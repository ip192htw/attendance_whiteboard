# 開發、環境與驗證

## 1. 工具需求

- Node.js 與 npm
- Supabase project
- Google OAuth 設定
- Upstash Redis REST database

實際版本以 `package.json` 與 lockfile 為準。正式上線環境的設定需在對應管理平台核對。

## 2. 安裝

```bash
npm install
```

本地啟動：

```bash
npm run dev
```

預設網址：`http://localhost:3000`。

## 3. 環境變數

建立 `.env.local`，請使用自己的開發環境值：

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`：Supabase project URL。
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`：Supabase publishable key。

登入流程另需在 Supabase Auth 與 Google Cloud Console 設定 OAuth provider、callback／redirect URL。

### Upstash Redis（必要）

`utils/upstash/redis/user-rate-limiter.ts` 使用 `Redis.fromEnv()`，因此必須提供：

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

目前 rate limiter 使用 `@upstash/ratelimit` sliding window，設定為每個使用者每分鐘 60 次，prefix 為 `attendance:user-rate-limit`。使用到該 limiter 的 API 依實作回傳 `429` 與 `Retry-After`。

Upstash 是必要依賴，不是可選服務。請勿把 token 放入 `NEXT_PUBLIC_` 變數，也不要將真實憑證提交到 repository。

## 4. 外部平台設定

下列項目需由平台管理介面驗證，不能僅憑原始碼確認：

- Google OAuth application type：Internal。
- Google Groups：允許登入的授權群組。
- Google OAuth redirect／callback allow-list。
- Supabase Auth provider 與已套用的 migrations。
- Vercel Production／Preview 環境變數。
- Upstash Redis REST endpoint 與 token 是否有效。

## 5. 常用驗證指令

```bash
npm run lint
npx tsc --noEmit
npm run build
npm test
```

`npm test` 的 runner 設定為 Node.js 原生 `node --test`。如果測試因 ESM extensionless import 或測試檔案格式而失敗，請記錄實際錯誤；不要把替代 runner 成功當成 `npm test` 通過。

資料庫安全變更至少要驗證：

- monitor 只能讀取其授權班級的資料。
- monitor 無法直接 INSERT／UPDATE／DELETE `attendance.reports`，一般提交僅能經 RPC。
- instructor 可檢視設定，但不能 INSERT／UPDATE。
- supervisor 可檢視及修改設定。
- 一般回報在開放時間內可連續提交，不受 cooldown 阻擋。
- `correct_report` 只允許 instructor／supervisor，並新增快照。
- 每次提交／修正的操作者與時間戳記皆由資料庫端寫入。

## 6. 資料庫變更

目前權威 migration 目錄：

```text
supabase/migrations/
```

所有 schema、RLS、grant、trigger 與 RPC 變更都應新增 migration。`docs/sql/` 是已淘汰的前 Supabase 紀錄，不可用於初始化或重建目前資料庫。

## 7. 部署前檢查

- [ ] Supabase migration 狀態已核對。
- [ ] Google OAuth Internal 與 redirect URL 已驗證。
- [ ] Google Groups 授權群組已確認。
- [ ] Vercel Production／Preview 環境均設定 Supabase 與 Upstash 必要變數。
- [ ] Rate limiting API 已實際驗證。
- [ ] RLS、RPC 與角色權限測試已執行。
- [ ] `npm run lint`、型別檢查、build 與 test 結果已記錄。
- [ ] 已確認 UI 尚未完成的功能不會在文件中被描述為完整交付。