# 教官室白板系統 — 技術架構與技術選型

## 文件用途與版本

本文描述目前 repository 可確認的架構；資料庫實際定義以 `supabase/migrations/` 為準。`docs/sql/` 是引入 Supabase 前的歷史資料，已停止維護，應移除且不得作為部署來源。

專案版本 `1.0.0` 為第一個正式上線版本。此版本號不代表所有後續規劃與底層方法均已提供完整 UI。

## 1. 技術概覽

| 範圍 | 技術 | 責任 |
|---|---|---|
| Web framework | Next.js App Router | Routes、頁面、Server Actions、Route Handlers |
| UI | React、Tailwind CSS | 互動介面與呈現 |
| Language | TypeScript | 應用程式與 domain 型別 |
| Authentication | Supabase Auth + Google OAuth | 使用者登入 session |
| Database | Supabase PostgreSQL | 持久化資料、RLS、RPC |
| Application identity | `identity.users` | 應用角色與 Supabase Auth 使用者的關聯 |
| Domain | `src/domain/` | 業務服務、型別與 repository contracts |
| Infrastructure | `src/infra/supabase/` | Supabase repository/provider implementations |
| Composition | `src/container/` | 建立 client、repository 與 service dependencies |
| Rate limiting | Upstash Redis、`@upstash/ratelimit` | API 使用者層級限流 |
| Hosting | Vercel | Next.js 部署與環境變數 |

## 2. 主要資料流

```text
Google OAuth / Supabase Auth
          │
          ▼
Supabase session
          │
          ▼
Next.js proxy / route / Server Action
          │
          ├── DAL role guard（應用層操作檢查）
          │
          ├── Domain Service
          │      └── Repository interface
          │              └── Supabase implementation
          │
          ▼
PostgreSQL
  ├── identity schema
  ├── attendance schema
  ├── system schema
  ├── RLS
  └── SECURITY DEFINER RPC
```

Proxy／session 更新不是所有請求的完整授權機制。API 與 Server Actions 必須自行執行適當的授權檢查；資料庫仍須對直接資料存取與 RPC 呼叫執行權限驗證。

## 3. 程式分層

### `app/`

Next.js App Router 頁面、UI、Server Actions 與 Route Handlers。

### `src/dal/`

登入使用者與角色授權輔助方法，例如 `requireUser`、`requireInstructor` 與 `requireSupervisor`。這些方法保護應用程式操作入口，但不能取代資料庫權限。

### `src/domain/`

定義 domain types、repository contracts 與 service methods。部分方法負責組合資料或套用業務規則，部分方法是 repository 的薄包裝；不要假設每個 service 都包含複雜業務邏輯。

### `src/infra/supabase/`

將 domain repository/provider contracts 連接至 Supabase/PostgreSQL。

### `src/container/`

組裝 Supabase client、providers、repositories 與 services。

### `utils/`

Supabase browser/server/proxy helper，以及 Upstash Redis rate limiter。

## 4. 資料庫 schema

目前核心 schema：

- `identity`：應用程式使用者與 Auth 身分連結。
- `attendance`：回報快照與相關 RPC。
- `system`：系統設定。

不要再以 `public.users` 或 `school.classes` 作為現況資料模型描述；這些名稱屬於早期設計文件中的舊方案。

## 5. 身分與授權

- Google OAuth 設定為 Internal；校方 IT 另以 Google Groups 限制授權群組。
- `identity.link_identity()` 將已驗證 session 與預先建立的應用程式使用者連結。
- `identity."current_user"()` 以 `auth.uid()` 對應 `identity.users.auth_user_id`。
- RPC 依資料庫 session 身分與 `identity.users.role` 執行角色檢查。
- `attendance.reports` 的一般讀取由 RLS 控制；直接寫入權限被撤銷，資料寫入透過受控 RPC。
- 應用層 guard 與資料庫授權是互補防線，不可用 UI 隱藏代替資料庫授權。

### 已知需對齊的權限差異

正式業務規則是只有 `supervisor` 可修改 `system.settings`。但現有 migration 的 `settings_insert` 與 `settings_update` policy 仍允許 `instructor`。此差異應透過後續 migration 修正並驗證；本文件不將其描述為已完成的安全保證。

## 6. Attendance snapshot model

`attendance.reports` 的主要欄位為：

```text
id
class
report_date
submitted_by
submitted_at
payload (JSONB)
```

每筆資料是一個完整快照。一般提交與歷史修正均採追加快照模型，保留先前版本。最新有效回報依 `submitted_at` 排序取得；如時間戳記可能相同，讀取邏輯應加入唯一欄位作為次要排序，確保結果穩定。

### `submit_report`

一般風紀回報 RPC。根據 session 辨識操作者與班級，驗證角色、回報日期、開放時間及 payload，並新增快照。

**業務規則：** 開放時間內可再次提交，不應由 cooldown 阻擋。現有 repository 尚保留 `REPORT_COOLDOWN` 錯誤碼，因此此規則仍需與實際 SQL／呼叫路徑核對並對齊。

### `correct_report`

歷史修正 RPC，可指定班級、日期及 payload；僅 `instructor` 與 `supervisor` 可操作。它不受一般回報開放時間限制，但仍驗證操作者、班級／日期參數與 payload，並新增快照，不覆寫原紀錄。資料庫 RPC 與 Repository／Service 方法存在，完整前端操作流程尚未完成。

### 操作者稽核

`submitted_by` 必須表示執行該筆操作的實際操作者。操作者由 RPC 根據 session 認定，不應接受前端傳入的任意操作者身分。

## 7. Upstash Rate Limiting

Upstash Redis 是目前 API rate limiting 的必要依賴，不是可選的未來基礎設施。

`utils/upstash/redis/user-rate-limiter.ts` 使用 `Redis.fromEnv()`，並透過 `@upstash/ratelimit` 設定 sliding window：每個使用者每分鐘 60 次；prefix 為 `attendance:user-rate-limit`。目前已知的使用位置包含使用者 API 路由。

所需環境變數：

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

部署環境必須提供有效的 Upstash REST URL 與 token。具體哪些 API 使用 limiter，應以目前程式呼叫點為準，不應將此限流誤寫成 attendance submission 的 cooldown。

## 8. 時間與時區

資料庫回報時間採 `submitted_at`，歷史有效版本依時間戳記排序。部分資料庫日期驗證明確使用 `Asia/Taipei`；應用層日期格式化亦須注意時區一致性。修改日期查詢時，需避免依賴執行環境的預設時區。

## 9. Migration 與資料庫變更

`supabase/migrations/` 是目前資料庫定義的版本化來源。所有 schema、RPC、RLS 或授權規則變更應透過新的 migration 表達，不應將過時 SQL 範例當作目前資料庫的可執行重建腳本。

`docs/sql/` 是引入 Supabase 前的歷史紀錄，已停止更新，應從 repository 移除。

## 10. 外部部署設定

以下設定無法僅從 repository 證明線上實際狀態：

- Google Cloud OAuth app 的 Internal 設定與 redirect allow-list。
- Google Groups 的授權成員。
- Supabase Auth provider 與線上 migration 套用狀態。
- Vercel Production／Preview environment variables。
- Upstash production database credentials 與實際服務狀態。

文件可記錄已確認的部署設計，但驗證線上狀態時仍須檢查對應管理平台。