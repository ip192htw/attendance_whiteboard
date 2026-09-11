# 教官室白板系統
## Technical Architecture & Technology Selection

**版本：** 1.0  
**Phase：** 1

---

# 1. Architecture Overview

```text
┌───────────────────────┐
│    Google Workspace   │
└───────────┬───────────┘
            │ OAuth
            ▼
┌───────────────────────┐
│     Supabase Auth     │
└───────────┬───────────┘
            │ JWT
            ▼
┌───────────────────────┐
│       Next.js         │
│   App Router / RSC    │
└───────────┬───────────┘
            │
            ▼
┌─────────────────────────────────┐
│            Supabase             │
│                                 │
│ PostgreSQL │ RLS │ RPC          │
└─────────────────────────────────┘
            ▲
            │
       Vercel Hosting
```

---

# 2. Technology Selection

## 2.1 Next.js

採用 Next.js App Router。

原因：

- React-based
- Server Components
- Server Actions / Route Handlers
- 與 Vercel 整合良好
- 適合本系統以角色為中心的多頁面 application
- 可將部分 business orchestration 放在 server side

---

## 2.2 Supabase

Supabase 作為主要 backend platform。

使用：

```text
Authentication
PostgreSQL
Row Level Security
PostgreSQL Functions / RPC
```

不在 Phase 1 使用：

```text
Storage
Realtime
Edge Functions
```

除非後續需求需要。

---

## 2.3 PostgreSQL

PostgreSQL 作為主要資料庫。

選擇原因：

- RLS
- JSONB
- Transaction
- PostgreSQL Functions
- Aggregation
- Index
- Constraint

尤其本系統的 append-only attendance snapshot 非常適合 PostgreSQL。

---

## 2.4 Vercel

Vercel 負責 Next.js deployment。

主要用途：

- Web hosting
- Preview deployment
- Production deployment
- Environment variables
- Next.js runtime

Vercel IP restriction 可作為額外網路層控制，但不得作為主要 authorization mechanism。

---

# 3. Schema Strategy

建議不要將所有資料放入 `public`。

推薦：

```text
auth
└── users

public
└── users

school
└── classes

attendance
└── reports

system
└── settings
```

未來需要時再增加：

```text
school
├── academic_terms
└── holidays
```

或：

```text
analytics
└── ...
```

Phase 1 不預先建立不必要的 schema。

---

# 4. Authentication Architecture

Supabase Auth 負責 authentication。

Application user：

```text
public.users
```

負責：

- user identity
- role
- active status
- application-specific metadata

JWT 僅保留需要高頻讀取的角色資訊，例如：

```text
role = monitor
```

不建議將班級、完整人員資訊等 mutable business data 放進 JWT。

---

# 5. Authorization Architecture

Authorization 分成兩層。

## Application layer

Next.js 根據：

```text
session
role
```

決定 UI。

## Database layer

Supabase RLS 決定資料實際能否被讀寫。

因此：

```text
UI hiding ≠ Security
```

真正 security boundary 為 PostgreSQL RLS。

---

# 6. Role Model

```text
monitor
instructor
supervisor
```

權限概念：

```text
monitor
  ├── attendance SELECT
  └── attendance INSERT

instructor
  ├── attendance SELECT
  ├── attendance UPDATE（依業務規則）
  └── monitor management

supervisor
  └── instructor + system administration
```

---

# 7. Attendance Architecture

Attendance 採 append-only submission model。

```text
attendance.reports

id
class_id
report_date
submitted_by
submitted_at
payload
```

其中：

```text
payload jsonb
```

格式：

```json
{
  "sick": [2, 3],
  "leave": [17],
  "official": [25]
}
```

每一列代表一次完整 snapshot。

---

# 8. Why JSONB

與：

```text
attendance_records
```

逐一儲存學生資料相比，JSONB snapshot 更符合本系統需求。

例如：

```text
301 班
45 人

sick: [2,3]
leave: [17]
```

只需要保存實際有特殊狀態的學生。

因此：

- 班級人數不同不影響 schema
- 不需要 student table
- 不需要每次提交產生 45 rows
- 每次 submission 自然形成 immutable snapshot

---

# 9. Latest Submission

取得目前狀態：

```sql
SELECT *
FROM attendance.reports
WHERE class_id = $1
  AND report_date = $2
ORDER BY submitted_at DESC
LIMIT 1;
```

建立 index：

```text
(class_id, report_date, submitted_at DESC)
```

---

# 10. Submission History

教官查看歷史：

```sql
SELECT *
FROM attendance.reports
WHERE class_id = $1
  AND report_date = $2
ORDER BY submitted_at ASC;
```

因此 submission history 本身即為 audit history。

不建立額外 audit log。

---

# 11. RPC

風紀提交應透過 RPC。

概念：

```text
submit_attendance(
    class_id,
    report_date,
    payload
)
```

RPC 執行：

```text
1. 取得 auth.uid()
2. 確認 application user
3. 確認 role
4. 確認 class ownership
5. 確認 report date
6. 取得 system settings
7. 判斷 report window
8. 找最新 submission
9. 判斷 cooldown
10. INSERT
11. 回傳新資料
```

Frontend 不直接決定是否允許 submission。

---

# 12. Cooldown

Cooldown 為 business rule。

例如：

```text
last submission = 07:42
cooldown = 60 sec
```

則：

```text
07:42:30 → reject
07:43:00 → allow
```

Cooldown 應由 RPC enforcement。

---

# 13. RLS Strategy

風紀：

```text
SELECT
INSERT
```

不提供：

```text
UPDATE
DELETE
```

因此風紀無法修改或刪除歷史 submission。

教官及生輔組長依管理需求提供較高權限。

---

# 14. Database Integrity

必要 constraint：

```text
id UUID primary key

class_id NOT NULL

report_date NOT NULL

submitted_by NOT NULL

submitted_at NOT NULL

payload NOT NULL
```

建議：

```text
payload JSONB
```

並透過 RPC 驗證 payload 結構。

---

# 15. Settings Architecture

```text
system.settings

key
value
updated_by
updated_at
```

例如：

```text
attendance.report_start
attendance.report_end
attendance.cooldown_seconds
```

`value` 可採 text 儲存，再由 application / RPC 根據設定類型解析。

若後續設定型別變得複雜，可再增加：

```text
value_type
```

但 Phase 1 不必過度設計。

---

# 16. Statistics Architecture

Phase 1：

不建立 statistics table。

只使用：

```text
COUNT
GROUP BY
latest submission
JSONB aggregation
```

產生：

```text
30 / 45
```

等簡單 metric。

Phase 2 再評估：

```text
VIEW
MATERIALIZED VIEW
aggregation table
```

不提前引入 data warehouse。

---

# 17. Security Principles

安全模型：

```text
Google Workspace
       +
Supabase Auth
       +
application whitelist/status
       +
JWT role
       +
RLS
       +
RPC business rules
```

任何一層失效時，其他層仍應維持必要防護。

---

# 18. Vercel IP Restriction

IP restriction 僅作為 defense-in-depth。

不可假設：

```text
校內 IP = trusted user
```

真正 identity 仍然由 Google OAuth 提供。

真正 data authorization 仍由 RLS 提供。

---

# 19. Phase 1 Architecture Principle

優先保持：

```text
少 schema
少 table
少 background job
少 infrastructure
```

不提前加入：

```text
Redis
Queue
Cron
Data warehouse
Analytics platform
Realtime
Audit system
Calendar engine
```

直到需求真正需要。