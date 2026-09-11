# 教官室白板系統
## Database / RLS / RPC Specification

---

# 1. Database Structure

```text
auth.users

public.users

school.classes

attendance.reports

system.settings
```

---

# 2. public.users

```sql
id UUID PRIMARY KEY
email TEXT NOT NULL
name TEXT NOT NULL
role user_role NOT NULL
is_active BOOLEAN NOT NULL DEFAULT true
created_at TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
```

Role：

```text
monitor
instructor
supervisor
```

`id` 對應：

```text
auth.users.id
```

---

# 3. school.classes

```sql
id UUID PRIMARY KEY
grade SMALLINT NOT NULL
class_no SMALLINT NOT NULL
name TEXT NOT NULL
is_active BOOLEAN NOT NULL DEFAULT true
```

例如：

```text
1年1班
1年2班
2年1班
```

實際班級／帳號 mapping 可由資訊單位提供或維護。

---

# 4. attendance.reports

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

class_id UUID NOT NULL

report_date DATE NOT NULL

submitted_by UUID NOT NULL

submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()

payload JSONB NOT NULL
```

Foreign keys：

```text
class_id
→ school.classes.id

submitted_by
→ public.users.id
```

---

# 5. Payload

標準格式：

```json
{
  "sick": [2, 3],
  "leave": [17],
  "official": [25],
  "absent": [31]
}
```

允許的 key 應由系統定義。

例如：

```text
sick
leave
official
absent
```

未來新增假別時可擴充。

---

# 6. Payload Semantics

Payload 是「該次提交時的完整班級出缺勤 snapshot」。

不是 delta。

因此：

```text
第一次：
sick: [2,3]

第二次：
sick: [2]
leave: [17]
```

第二筆代表完整新狀態，而不是：

```text
remove 3
add 17
```

這個定義必須固定。

---

# 7. Attendance Read Policy

最新資料：

```sql
WHERE class_id = ?
AND report_date = ?
ORDER BY submitted_at DESC
LIMIT 1
```

完整歷史：

```sql
WHERE class_id = ?
AND report_date = ?
ORDER BY submitted_at ASC
```

---

# 8. Monitor RLS

## SELECT

允許風紀讀取自己所屬班級的資料。

條件：

```text
auth.uid()
→ public.users
→ 所屬班級
→ attendance.reports.class_id
```

## INSERT

允許：

```text
role = monitor
```

且：

```text
class_id = 自己所屬班級
```

## UPDATE

禁止。

## DELETE

禁止。

---

# 9. Instructor RLS

教官可讀取系統內需要管理的 attendance records。

若教官具有業務上的修正權限：

```text
UPDATE
```

由 RLS 允許。

實際 update operation 仍應由明確 business function 執行，以避免任意修改 immutable monitor submission。

---

# 10. Supervisor RLS

生輔組長具有完整系統管理權限。

包括：

```text
users
classes
attendance
settings
```

具體權限由各 table policy 定義。

---

# 11. RPC: submit_attendance

推薦 interface：

```text
submit_attendance(
    p_class_id UUID,
    p_report_date DATE,
    p_payload JSONB
)
```

RPC 必須：

```text
SECURITY DEFINER
```

並設定明確：

```text
search_path
```

避免依賴 caller 的 database privileges。

---

# 12. RPC Validation

執行順序：

### Step 1

取得：

```text
auth.uid()
```

### Step 2

確認：

```text
public.users
```

存在且：

```text
is_active = true
```

### Step 3

確認：

```text
role = monitor
```

### Step 4

確認：

```text
p_class_id
```

為該風紀所屬班級。

### Step 5

確認日期為允許填報日期。

Phase 1 可採簡化規則：

```text
report_date = current_date
```

### Step 6

讀取：

```text
system.settings
```

取得：

```text
attendance.report_start
attendance.report_end
attendance.cooldown_seconds
```

### Step 7

確認目前時間位於 report window。

### Step 8

查詢該班今日最新 submission。

### Step 9

確認 cooldown。

### Step 10

INSERT 新 submission。

### Step 11

return inserted row。

---

# 13. Race Condition

Cooldown check 與 INSERT 必須在同一個 transaction／RPC execution context 中完成。

不能：

```text
Client
 ↓
SELECT last submission
 ↓
Client 判斷 cooldown
 ↓
INSERT
```

否則兩個 request 可以同時通過。

正確：

```text
RPC
 ├── lock / consistency check
 ├── cooldown validation
 └── INSERT
```

---

# 14. Settings

```sql
system.settings

key TEXT PRIMARY KEY

value TEXT NOT NULL

updated_by UUID

updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
```

範例：

```text
attendance.report_start
07:30

attendance.report_end
08:00

attendance.cooldown_seconds
60
```

---

# 15. Settings Validation

不同設定應有 server-side validation。

例如：

```text
report_start
HH:mm

report_end
HH:mm

cooldown_seconds
positive integer
```

不能只相信 frontend。

---

# 16. Data Retention

Phase 1 不主動刪除 attendance history。

因為資料本身具有歷史與行政用途。

若未來需要 retention policy，另行定義：

```text
retention period
archive strategy
deletion authority
```

---

# 17. Indexes

至少：

```text
attendance.reports
INDEX (
    class_id,
    report_date,
    submitted_at DESC
)
```

以及：

```text
submitted_by
```

相關查詢 index。

若第一期資料量仍小，不需要大量建立 index。

---

# 18. Simple Metrics

例如：

```text
已回報班級
```

概念：

```sql
SELECT COUNT(DISTINCT class_id)
FROM attendance.reports
WHERE report_date = CURRENT_DATE;
```

再與 active classes 數量比較：

```text
30 / 45
```

這類 metric 不需要額外資料表。

---

# 19. Audit Philosophy

本系統不建立獨立 audit log。

原因：

```text
monitor submission = append-only
```

所以：

```text
submission history
=
audit history
```

每筆資料本身已具有：

```text
submitted_by
submitted_at
payload
```

因此可以完整重建風紀填報歷程。

若未來教官的修改需求變成：

```text
修改既有 submission
```

且需要保留 before/after：

則再評估增加：

```text
audit_logs
```

目前不提前建立。