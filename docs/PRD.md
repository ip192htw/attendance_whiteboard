# 教官室白板系統 — 產品需求與業務規則

## 文件用途

本文件記錄已確認的業務規則。它不取代實際程式碼或資料庫 migration；當「預期規則」與「目前實作」不一致時，必須明確記錄差異，不可把需求直接寫成已完成的實作。

- 專案版本：`1.0.0`（第一個正式上線版本）
- 技術平台：Next.js、Vercel、Supabase、PostgreSQL
- 更新紀錄：[`updates.md`](updates.md)

## 1. 產品定位

教官室白板系統提供校內出缺勤回報、回報歷史檢視、教官管理與系統設定功能。系統以校內 Google Workspace 身分作為登入入口，並透過角色授權及資料庫端規則控制操作。

## 2. 角色與權限

| 角色 | 業務職責 |
|---|---|
| `monitor` | 風紀股長；每班配置兩位，互為備援，負責所屬班級的每日回報 |
| `instructor` | 教官；檢視各班回報與歷史紀錄，並可使用歷史報告修正能力 |
| `supervisor` | 生輔組長；具備教官權限，並管理系統設定與系統層級事項 |

### 系統設定權限

- 已授權使用者可以檢視系統設定。
- 只有 `supervisor` 可以新增或修改系統設定。
- `instructor` 不得修改系統設定。
- `monitor` 不提供系統設定管理操作。

這是正式業務規則。現有 migration 的 `settings_insert`／`settings_update` policy 仍包含 `instructor`，因此資料庫授權需透過後續 migration 對齊。

## 3. 一般回報規則

1. 風紀只能代表其已授權的班級回報。
2. 一般回報僅能在系統設定的開放時間內提交。
3. 在開放時間內，風紀可以再次提交；不得以固定 cooldown 阻擋符合開放時間與授權條件的提交。
4. 每班兩位風紀股長互為備援；其中一人無法操作時，另一人仍可提交。
5. 每次成功提交都新增一筆獨立的完整快照，不更新或刪除先前快照。
6. 快照的有效內容是提交當下整份班級狀態，不是相對於前一筆的差異。

### 最新有效回報

同一班級、同一日期可能存在多筆快照。最新有效回報依資料庫寫入的 `submitted_at` 時間戳記排序取最新一筆。若排序欄位可能相同，查詢應加入穩定的次要排序條件（例如唯一 `id`），避免結果不確定。

### 實作差異

目前 repository 的回報 Repository 仍包含 `REPORT_COOLDOWN` 錯誤碼，README 與既有 SQL migration／實作亦曾包含 cooldown 規則。這些必須與正式需求對齊；本文件記錄預期業務規則，不宣稱程式已完成修正。

## 4. 歷史回報修正

`correct_report` 是供教官以上角色使用的歷史修正 RPC，並非未定用途的預留方法。

- 操作者：`instructor` 或 `supervisor`。
- 操作對象：可由呼叫端指定班級及日期。
- 一般回報開放時間：不適用於歷史修正；修正不受一般回報時間窗限制。
- 保存方式：與一般提交採相同的追加快照模型，新增修正版快照，不覆寫原始紀錄。
- 稽核：每筆新快照必須記錄實際執行該次操作的操作者。
- 前端狀態：資料庫 RPC、Repository 與 Domain Service 方法已存在；尚未提供完整的 Server Action／UI 呼叫流程。

RPC 目前限制未來日期，並驗證 payload；此類具體實作條件應以 migration 為準。

## 5. 操作者與稽核

操作者身分必須由資料庫 RPC 根據已驗證的 Supabase 使用者 session 辨識，不可信任前端傳入的 `submitted_by`。

每筆回報或修正紀錄都必須保存實際操作者及資料庫回報時間。`submitted_by` 是稽核依據，不得在修正時沿用原始提交者身分。

現有資料欄位使用 `submitted_by` 與 `submitted_at`；安全強化 migration 中 `correct_report` 以已連結使用者的 email 記錄操作者。文件應維持這個欄位語意，並在未來若調整識別格式時確保可追溯性。

## 6. 身分驗證與授權

- Google OAuth 使用者類型設定為 `Internal`。
- 校方 IT 另透過 Google Groups 限制允許登入的群組。
- Google OAuth 的組織範圍與 Google Groups 群組授權是不同控制層。
- Supabase Auth session 與 `identity.users.auth_user_id` 關聯應用程式身分。
- 資料庫 RPC 依 `auth.uid()` 辨識已連結的使用者，並依資料庫角色執行授權檢查。
- RLS 控制資料讀取範圍；`attendance.reports` 的直接 INSERT／UPDATE／DELETE 應受限，寫入經受控 RPC 執行。

線上 Google Cloud、Google Groups、Supabase Auth provider 與 redirect allow-list 的實際設定狀態，無法只由 repository 驗證。

## 7. 資料模型概念

### `identity.users`

保存預先建立的應用程式身分、email、name、role、class 及 `auth_user_id` 關聯。

### `attendance.reports`

| 欄位 | 語意 |
|---|---|
| `id` | 每筆快照的唯一識別碼 |
| `class` | 班級識別 |
| `report_date` | 該份回報代表的日期 |
| `submitted_by` | 實際執行此次提交／修正的操作者 |
| `submitted_at` | 資料庫記錄的此次操作時間 |
| `payload` | 完整回報內容，JSONB |

### `system.settings`

以 key-value 資料列保存系統設定。授權使用者可以檢視，只有生輔組長可以修改。

## 8. 功能狀態標記原則

文件與 README 使用以下區分：

- **已實作：** 可在目前程式碼中找到完整操作流程。
- **底層已實作、UI 尚未完成：** RPC、Repository 或 Service 方法存在，但沒有完整前端呼叫流程。
- **規劃／待修正：** 已確認需求，但目前程式或 migration 尚未符合。
- **外部設定：** 需在 Google Cloud、Google Groups、Supabase 或 Vercel 等平台核對。

不得因為某個 RPC 或 Service 方法存在，就宣稱對應功能已完整交付。