# 教官室白板系統

校園學生缺曠回報與管理系統，提供各班風紀進行每日回報，並讓教官與生輔組長集中查看、管理及追蹤各班回報紀錄。

本專案以 **Next.js + Supabase + PostgreSQL** 建置，將身份驗證、角色授權、回報規則與資料庫層級的存取控制分開處理。

## 功能

### 風紀

* 使用 Google 帳戶登入
* 查看目前所屬班級
* 於指定回報時段提交當日缺曠資料
* 支援回報冷卻時間，避免短時間內重複提交
* 查看目前回報狀態

### 教官

* 查看當日全校各班回報狀況
* 查看班級回報歷史
* 查看各班缺曠統計
* 管理風紀資料
* 依系統設定管理回報規則

### 生輔組長

除教官功能外，提供系統層級管理能力：

* 管理使用者與角色
* 管理學期及回報相關設定
* 調整班級編號規則
* 管理系統設定

## 技術架構

| Layer                  | Technology                                   |
| ---------------------- | -------------------------------------------- |
| Frontend / Application | Next.js 16, React 19                         |
| Styling                | Tailwind CSS 4                               |
| Authentication         | Supabase Auth + Google OAuth                 |
| Backend / Database     | Supabase                                     |
| Database               | PostgreSQL                                   |
| Authorization          | PostgreSQL Row Level Security                |
| Business Rules         | PostgreSQL RPC + Server-side domain services |
| Deployment             | Vercel                                       |
| Language               | TypeScript                                   |

整體資料流：

```text
Google Workspace
       │
       ▼
  Supabase Auth
       │
       │ JWT / Session
       ▼
     Next.js
  App Router / RSC
       │
       ▼
    Domain Layer
       │
       ▼
 Supabase / PostgreSQL
    │       │
    │       ├── RLS
    │       └── RPC
    │
    └── Attendance / Identity / System
```

## 權限模型

系統目前有三種 application role：

| Role         | 主要用途           |
| ------------ | -------------- |
| `monitor`    | 各班風紀，提交本班每日回報  |
| `instructor` | 教官，查看及管理回報與風紀  |
| `supervisor` | 生輔組長，進行人員與系統管理 |

應用程式層會依角色控制頁面與操作介面；資料庫則透過 **RLS** 作為實際的資料存取邊界。

因此，隱藏 UI 並不等同於授權。即使直接呼叫資料庫 API，也必須符合對應的 RLS policy。

## 回報資料模型

一次回報代表某班在某一天的一個完整 snapshot。

核心資料：

```text
attendance.reports
├── id
├── class
├── report_date
├── submitted_by
├── submitted_at
└── payload (JSONB)
```

例如：

```json
{
  "sick": [2, 3],
  "personal": [17],
  "official": [25]
}
```

採用 snapshot + append-only submission 的方式，可以保留同一天內的歷次提交紀錄，而不需要另外建立 audit log。

最新狀態則由：

```text
class + report_date + submitted_at
```

取得。

### 為什麼使用 JSONB

本系統不需要為每一次回報建立每位學生一筆資料。只保存實際具有缺曠狀態的學生編號，可以：

* 避免大量重複 row
* 支援不同班級人數
* 保留一次提交的完整狀態
* 讓歷史提交自然成為操作紀錄

## 專案結構

```text
attendance_whiteboard/
├── app/                  # Next.js App Router、頁面與 Server Actions
├── src/
│   ├── container/        # Domain dependencies / composition
│   ├── dal/              # Data access helpers
│   ├── domain/           # Domain models、repositories、services
│   └── infra/            # Supabase infrastructure implementations
├── utils/
│   └── supabase/         # Browser / Server Supabase clients
├── supabase/
│   └── migrations/       # Database migrations
├── docs/
│   ├── sql/              # Schema、RLS、RPC
│   └── ...               # Architecture documentation
├── scripts/              # Development / seed scripts
└── public/
```

Domain layer 與 infrastructure layer 分離，使 application logic 不需要直接依賴 Supabase 的具體實作。

例如 attendance domain 只依賴 repository interface：

```text
Domain
  │
  └── AttendanceRepository
          ▲
          │
          └── SupabaseReportRepository
```

## 本地開發

### Requirements

* Node.js
* npm
* Supabase project
* Google OAuth credentials

### 安裝

```bash
git clone https://github.com/ip192htw/attendance_whiteboard.git
cd attendance_whiteboard
npm install
```

### Environment Variables

建立 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Google OAuth 與 Supabase Auth 的 redirect URL 也需要依目前開發環境設定。

### 啟動開發伺服器

```bash
npm run dev
```

開啟：

```text
http://localhost:3000
```

### 其他指令

```bash
npm run build
npm run start
npm run lint
npm run seed:reports
```

## Database

資料庫 migration 位於：

```text
supabase/migrations/
```

主要 schema：

```text
identity
└── users

attendance
└── reports

system
└── settings
```

目前資料庫安全模型包含：

* Row Level Security
* Role-based access control
* PostgreSQL functions / RPC
* Application user 與 Supabase Auth user 的關聯
* 回報時間與 cooldown 等 business rules 的 server-side enforcement

相關 SQL 與設計文件：

* `docs/sql/schema.sql`
* `docs/sql/rls.sql`
* `docs/sql/rpc.sql`
* `docs/Technical Architecture & Technology Selection.md`

## 設計原則

### Security boundary 在資料庫

Next.js 負責 application flow 與 UI authorization；PostgreSQL RLS 負責最終資料存取權限。

### Business rules 不由前端決定

例如回報時間、學期範圍與 cooldown 等規則，前端可以提供即時 UI feedback，但真正的資料寫入條件由 server-side logic / RPC enforcement。

### 回報紀錄以 append-only 為核心

風紀不直接修改或刪除既有 submission。需要修正時，以新的 submission 或管理端 correction flow 處理。

### Phase 1 優先保持系統簡單

目前不預先引入 Redis、Queue、Realtime、Data Warehouse 或額外 audit system。

只有在實際需求出現時才增加 infrastructure。

## Project Status

目前專案處於持續開發階段。

Phase 1 的核心目標是完成：

* 每日班級缺曠回報
* 回報歷史
* 教官管理介面
* 使用者與角色管理
* 系統設定
* PostgreSQL RLS / RPC 安全模型

後續功能將依實際校務需求逐步擴充。

## License

此專案目前為校園內部系統開發專案，未另外宣告開源授權條款。
