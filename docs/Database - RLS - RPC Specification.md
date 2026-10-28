# 教官室白板系統 — Database / RLS / RPC Specification

## 1. 權威來源

目前資料庫 schema、函式、policy 與 grant 的實際定義，以 `supabase/migrations/` 為準。

本文件同時記錄正式業務規則及已知實作差異；當兩者不同時，不得把目標規則誤寫成目前已生效的資料庫行為。

## 2. Schema 與主要資料表

### `identity.users`

應用程式身分資料，核心概念包括：

- `email`
- `name`
- `role`
- `class`
- `auth_user_id`
- `created_at`
- `updated_at`

角色為 `monitor`、`instructor`、`supervisor`。`auth_user_id` 對應 Supabase Auth 的使用者識別碼；應用程式身分不應只依可變的 email claim 判斷。

### `attendance.reports`

| 欄位 | 用途 |
|---|---|
| `id` | 快照唯一識別碼 |
| `class` | 班級 |
| `report_date` | 該份回報代表的日期 |
| `submitted_by` | 實際執行本次提交／修正的操作者 |
| `submitted_at` | 本次操作的資料庫時間戳記 |
| `payload` | 完整回報快照，JSONB |

`payload` 是完整狀態，不是相對前一筆資料的 delta。每次成功提交或修正都新增獨立快照。

### `system.settings`

以 key-value rows 保存系統設定。已確認業務規則：所有授權角色可檢視，只有 `supervisor` 可新增或修改。

## 3. 身分辨識

安全強化 migration 定義：

- `identity."current_user"()`：依 `auth.uid()` 對應 `identity.users.auth_user_id`。
- `identity.link_identity()`：使用已驗證的 session identity 與預先建立的 email mapping 進行一次性連結。
- 資料表 policy 與 RPC 應使用資料庫已驗證的 session 身分，不應信任前端自填的操作者欄位。

`submitted_by` 必須記錄每次操作的實際操作者；歷史修正不能沿用原始風紀的身分。現有 `correct_report` 使用已連結使用者的 email 作為 `submitted_by` 值。

## 4. RLS 與權限邊界

### `attendance.reports`

- `monitor` 可讀取自己所屬班級的紀錄。
- `instructor` 與 `supervisor` 可讀取管理所需的回報紀錄。
- `authenticated` 與 `anon` 的直接 INSERT／UPDATE／DELETE 權限被撤銷。
- 寫入透過受控 PostgreSQL RPC 執行。

### `identity.users`

使用者讀寫權限依角色及 policy 控制；更新時由 trigger 限制敏感欄位變更，並保護 `auth_user_id` 等身分連結欄位。詳細行為以 migration 為準。

### `system.settings`

**正式規則：**
- SELECT：授權使用者可檢視。
- INSERT／UPDATE：僅 `supervisor`。
- DELETE：不開放給 `authenticated`／`anon`。

**已知實作差異：** 目前 `20261014001036_security_hardening.sql` 的 `settings_insert` 與 `settings_update` policy 允許 `instructor` 或 `supervisor`。這不符合已確認規則。應新增後續 migration 收斂 policy，而不是直接修改已套用的舊 migration，並在變更後驗證 instructor 的 INSERT／UPDATE 被拒絕。

## 5. RPC 契約

### `attendance.submit_report(p_payload jsonb)`

用途：一般風紀提交所屬班級的當日回報。

業務規則：

1. 依資料庫 session 取得實際操作者。
2. 驗證使用者身分與 `monitor` 角色。
3. 從已授權身分取得班級，不信任前端任意指定班級。
4. 驗證回報日期、開放時間與 payload。
5. 每次成功提交新增一筆完整快照。
6. `submitted_by` 與 `submitted_at` 記錄此次操作。

**正式時間規則：** 只要仍在開放時間內，即可再次提交；不得以固定 cooldown 阻擋合法提交。

**已知實作差異：** Repository 仍列有 `REPORT_COOLDOWN` 錯誤碼，README／舊規格亦曾記錄 cooldown。需核對目前生效的 RPC 與呼叫路徑，並以新 migration／程式修正對齊正式規則。這項差異在修正與測試完成前應保持可見。

### `attendance.correct_report(p_class text, p_report_date date, p_payload jsonb)`

用途：教官以上角色修正歷史回報。

已由 migration 確認的行為：

- 依 `auth.uid()` 對應 `identity.users`。
- 只允許 `instructor` 或 `supervisor`。
- 班級與日期由參數指定。
- 拒絕未來日期。
- 驗證 payload。
- 使用資料庫 `now()` 記錄此次操作時間。
- 新增一筆 `attendance.reports` 快照，不覆寫舊資料。
- `submitted_by` 記錄執行修正的操作者。

此 RPC 不受一般回報開放時間限制，但仍有身分、角色、參數與 payload 驗證。完整前端呼叫流程尚未完成。

## 6. 最新有效快照與排序

同一班級同一日期可有多筆快照。最新有效回報以 `submitted_at` 降冪排序取第一筆。

若可能有相同 `submitted_at`，應在所有取最新值的查詢中加入唯一且穩定的次要排序欄位，例如 `id`。應用層、RPC 與資料庫 query 的排序語意應保持一致。

歷史列表則應採明確且穩定的排序規則，並在 API／UI 文件中說明排序方向。

## 7. Payload 驗證

Payload 使用 JSONB，內容代表完整班級狀態。RPC 透過 `attendance.validate_report_payload()` 驗證格式。允許的假別與座號規則以目前 migration 的函式實作為準；變更驗證規則時應同步更新測試與文件。

## 8. 時間與日期

資料庫一般回報與歷史修正的日期檢查應以 `Asia/Taipei` 的校務日期語意為準。應用層不得依賴部署機器預設時區推算校務日期；涉及 `toLocaleDateString()` 等日期轉換時，需明確驗證時區行為。

## 9. Migration 變更原則

- 新的資料庫變更以新增 migration 表達。
- 不應修改已在環境中套用、且需要保留歷史的 migration 來假裝改變既有資料庫狀態。
- 變更 RLS、grant 或 RPC 後，應以實際角色 session 測試允許與拒絕的情境。