# 教官室白板系統

校園學生出缺勤回報與管理系統。風紀在指定開放時間內提交班級回報；教官與生輔組長檢視回報狀態、歷史紀錄及管理資料。

本專案以 **Next.js、Supabase 與 PostgreSQL** 建置。`1.0.0` 為第一個正式上線版本。

## 專案狀態

- **版本：** `1.0.0`
- **部署架構：** Next.js on Vercel；Supabase Auth 與 PostgreSQL
- **身分提供者：** Google OAuth，OAuth app 設為 Internal；校方 IT 另以 Google Groups 限制授權群組
- **資料庫權威來源：** `supabase/migrations/`
- **更新紀錄：** [`docs/updates.md`](docs/updates.md)

`1.0.0` 表示第一個正式上線版本，不代表所有規劃功能都已完成。部分底層方法已存在，但尚未接上完整的 Server Action／UI 流程；請參閱以下文件中的「實作狀態」說明。

## 角色與核心業務規則

| 角色 | 定位與權限 |
|---|---|
| `monitor` | 每班配置兩位風紀股長互為備援；可在開放時間內提交所屬班級回報 |
| `instructor` | 教官；檢視回報、歷史紀錄與相關管理資料，可透過歷史修正流程修正回報 |
| `supervisor` | 生輔組長；具備教官權限，並負責系統設定與系統層級管理 |

已確認的回報規則：

- 只要仍在開放時間內，風紀即可再次提交；一般回報不應因固定 cooldown 而被拒絕。
- 每次提交新增一筆獨立快照，不覆寫先前紀錄。
- 當日有效回報以 `submitted_at` 時間戳記排序後的最新快照為準。
- `correct_report` 供教官以上角色修正歷史日期；可指定班級與日期，不受一般回報開放時間限制。
- 每筆回報／修正都要記錄實際操作者。操作者由資料庫 RPC 依已驗證 session 辨識，不信任前端自行提供的身分。
- 所有授權使用者可檢視系統設定；只有 `supervisor` 可以修改。

> **實作差異提醒：** 目前 repository 中的 migration 仍可見 `system.settings` INSERT／UPDATE policy 允許 `instructor`，既有回報實作也保留 cooldown 相關程式／錯誤碼。這些與已確認的正式規則不一致，需以後續資料庫 migration／程式修正處理；在修正並驗證前，不應宣稱底層已完全符合規則。

## 技術概覽

| 範圍 | 技術／責任 |
|---|---|
| Web application | Next.js App Router、React、TypeScript |
| UI styling | Tailwind CSS |
| Authentication | Supabase Auth + Google OAuth |
| Application identity | `identity.users`，透過 `auth_user_id` 關聯 Supabase Auth 使用者 |
| Data store | PostgreSQL via Supabase |
| Database security | RLS、最小資料表授權、受控 PostgreSQL RPC |
| Domain logic | `src/domain/` 服務與 repository contracts |
| Infrastructure | `src/infra/supabase/` |
| Dependency composition | `src/container/` |
| API rate limiting | Upstash Redis + `@upstash/ratelimit` |
| Hosting | Vercel |

## 技術文件

- [產品需求與業務規則](docs/PRD.md)
- [技術架構與請求流程](docs/Technical%20Architecture%20%26%20Technology%20Selection.md)
- [資料庫、RLS 與 RPC 規格](docs/Database%20-%20RLS%20-%20RPC%20Specification.md)
- [本地開發、環境變數與驗證](docs/development.md)
- [更新紀錄](docs/updates.md)

資料庫 schema 與 RPC 的實際定義以 `supabase/migrations/` 為準。`docs/sql/` 是引入 Supabase 前的歷史紀錄，已停止維護，不應再作為 schema 參考或部署來源；該目錄預計從 repository 移除。

## 專案結構

```text
app/                       # Next.js routes, pages, UI, Server Actions, Route Handlers
src/
  application/             # Application-level errors / action helpers
  container/               # Dependency composition
  dal/                     # Authentication and authorization helpers
  domain/                  # Domain types, repository contracts, services
  infra/supabase/          # Supabase-backed repository/provider implementations
utils/
  supabase/                # Supabase browser/server/proxy helpers
  upstash/redis/           # Redis client and user rate limiter
shared/time/               # Shared application time helpers
supabase/migrations/       # Database migrations; authoritative SQL history
docs/                      # Maintained technical documentation
scripts/                   # Development and seed scripts
```

## 本地開發

### 需求

- Node.js（建議使用目前專案與部署環境相容的 LTS 版本）
- npm
- Supabase project
- Google OAuth configuration
- Upstash Redis REST database

### 安裝與啟動

```bash
git clone https://github.com/ip192htw/attendance_whiteboard.git
cd attendance_whiteboard
npm install
npm run dev
```

開啟 `http://localhost:3000`。

### 必要環境變數

建立 `.env.local`，填入各環境自己的值：

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Upstash Redis 是必要設定。`Redis.fromEnv()` 會讀取 `UPSTASH_REDIS_REST_URL` 與 `UPSTASH_REDIS_REST_TOKEN`；缺少有效設定時，使用到 rate limiter 的功能無法正常運作。請勿將真實憑證提交到 Git。

Google OAuth 的 redirect URL、Supabase Auth provider、Vercel environment variables 與 Google Groups 授權需在對應管理平台設定。這些線上設定無法只靠 repository 內容驗證。

### 常用指令

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run build
npm test
npm run seed:reports
```

測試提醒：目前 `npm test` 使用 Node.js 原生 test runner；既有測試中曾出現 extensionless ESM import 解析問題。若測試失敗，請確認實際 Node.js 版本、測試檔案格式與 runner 設定；不要把替代 runner 的結果當成 `npm test` 已通過。資料庫 RPC、RLS 與部署平台設定仍需獨立驗證。

## 資料模型與安全邊界

主要 schema：

- `identity.users`：應用程式身分、角色、班級與 Supabase Auth 身分關聯。
- `attendance.reports`：每次提交／修正產生一筆完整 JSONB snapshot。
- `system.settings`：系統設定 key-value rows。

一般資料寫入透過 PostgreSQL RPC；資料庫以 session 對應的使用者身分執行授權檢查。前端隱藏按鈕或 Server Action 的角色檢查不能取代資料庫授權。

## 授權與部署注意事項

1. Google OAuth Internal 與 Google Groups 是兩層不同的登入限制；請分別維護。
2. API rate limiting 依賴 Upstash Redis，部署環境必須設定其 REST URL 與 token。
3. `attendance.reports` 的歷次快照不可因新提交而覆寫；查詢最新狀態時使用回報時間戳記排序。
4. 系統設定的正式規則是只有 `supervisor` 可修改；目前 migration 中仍有允許 `instructor` 寫入的 policy，需透過後續 migration 修正並驗證。
5. 一般回報的正式規則是在開放時間內可重複提交；目前 repository 尚有 cooldown 相關邏輯待對齊。
6. `correct_report` 的資料庫 RPC 與底層 Repository／Domain Service 方法已存在，但尚未提供完整的前端呼叫流程。

## 授權

本專案為校園內部系統開發專案；repository 未宣告一般開源授權。未經專案權利人授權，不應假設可以重新散布或商業使用。