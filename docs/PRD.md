# 教官室白板系統
## Product Requirements Document

**文件版本：** 1.0  
**產品階段：** Phase 1  
**技術方向：** Next.js + Supabase + Vercel  
**目標使用者：** 風紀、教官、生輔組長

---

## 1. 產品定位

教官室白板系統是一套供校內教官室使用的數位化出缺勤回報與管理系統。

系統以校內 Google Workspace 身分作為登入入口，依使用者角色提供不同操作介面：

- 風紀：於指定回報時間內完成所屬班級每日出缺勤回報
- 教官：查看全校班級回報狀況、歷史紀錄及填報異動
- 生輔組長：管理教官與風紀名單、系統設定及資料匯出

Phase 1 以「每日填報流程、權限控管、歷史紀錄」為核心，不提前導入複雜統計及行事曆系統。

---

# 2. 產品目標

## 2.1 主要目標

1. 將傳統白板／紙本出缺勤回報數位化。
2. 降低風紀每日填報的操作成本。
3. 讓教官可以快速確認各班是否完成回報。
4. 保留每一次填報的完整歷史紀錄。
5. 透過角色與資料庫權限避免未授權修改。
6. 讓行政人員可以自行調整系統基本設定。

## 2.2 非目標

Phase 1 不包含：

- 完整校務行事曆系統
- 國定假日自動同步
- 複雜統計分析
- 圖表視覺化
- 學生個人帳戶
- 學生個人出缺勤查詢
- 通知系統
- QR Code
- 外部公開 API
- 完整人員／班級主檔管理

---

# 3. 使用者角色

## 3.1 風紀

主要工作：

- Google 登入
- 查看自己所屬班級
- 在指定時間內填報當日出缺勤
- 查看當日既有填報結果
- 於 cooldown 通過後重新提交
- 查看自己班級的忘記回報次數

權限：

- Attendance：SELECT
- Attendance：INSERT
- 不具 UPDATE
- 不具 DELETE
- 不可修改系統設定
- 不可修改其他使用者資料

---

## 3.2 教官

教官為系統主要管理使用者之一。

主要工作：

- 查看當日全校回報狀況
- 查看各班出缺勤資料
- 查看各班歷史填報
- 查看同一天多次提交的完整歷史
- 編輯／修正班級填報資料
- 查看風紀名單
- 管理風紀名單
- 查看簡單統計資訊

教官不負責系統層級權限管理。

---

## 3.3 生輔組長

生輔組長為系統最高業務管理角色。

除具備教官所有功能外：

- 管理教官名單
- 管理全域系統設定
- 設定回報時間
- 設定 cooldown
- 設定學期相關日期
- 資料匯出

---

# 4. 身分驗證

系統使用 Google Workspace OAuth。

校方 Google Cloud 專案預計將 OAuth 應用程式設定為 Internal，因此只有校內 Google Workspace 帳號可以完成登入。

登入流程：

```text
Google Workspace
       ↓
Supabase Auth
       ↓
JWT
       ↓
取得 role
       ↓
public.users
       ↓
確認帳號是否 active
       ↓
進入對應角色介面
```

Google 帳號與班級等基礎人員資料由校內資訊單位維護，系統不重複建立完整學生主檔。

---

# 5. Phase 1 核心流程

## 5.1 風紀回報流程

```text
Google 登入
    ↓
確認帳號
    ↓
確認角色 = 風紀
    ↓
取得所屬班級
    ↓
判斷目前時間
    ↓
是否位於回報時間？
 ┌──┴──┐
否      是
│       │
拒絕頁  取得今日最新填報
│       │
顯示    顯示班級、日期、目前資料
忘記    │
回報次數 ↓
        選擇缺席學生與假別
             ↓
          Submit RPC
             ↓
       Server / DB 驗證
             ↓
          cooldown
             ↓
           INSERT
```

---

# 6. 出缺勤資料模型

每一次提交皆視為一筆完整 snapshot。

不更新舊資料。

例如：

```json
{
  "sick": [2, 3],
  "leave": [17],
  "official": [25]
}
```

其中 key 為假別，value 為學生座號陣列。

例如：

```text
sick: 2,3
leave: 17
official: 25
```

這種設計具有以下優點：

1. 不需要建立每位學生的資料列。
2. 不受各班人數不同影響。
3. 一次提交即代表當下整個班級狀態。
4. 歷史紀錄天然為 immutable snapshot。
5. 查詢最新資料簡單。
6. 第二期統計可以從 JSONB 展開。
7. 不需要另外建立 audit log 來保存風紀的修改歷史。

---

# 7. 多次填報

風紀不直接 UPDATE 舊資料。

例如：

```text
07:42
sick: [2,3]

07:51
sick: [2,3]
leave: [17]

07:58
sick: [2]
leave: [17,21]
```

三筆資料皆保留。

系統將最後一筆視為目前狀態。

因此：

```text
最新狀態
=
ORDER BY submitted_at DESC
LIMIT 1
```

而：

```text
完整編輯歷程
=
所有當日 submission
ORDER BY submitted_at
```

---

# 8. Cooldown

為避免使用者透過重複提交故意大量建立資料，所有風紀提交皆須通過 cooldown。

概念：

```text
last_submission_at
+
cooldown
<
current_timestamp
```

未達 cooldown：

```text
拒絕提交
```

cooldown 為 system setting，由生輔組長設定。

Cooldown 的 enforcement 必須位於 RPC／資料庫層，而非僅依賴前端。

---

# 9. 回報時間

風紀只有在指定回報時間內可以建立新填報。

例如：

```text
report_start = 07:30
report_end   = 08:00
```

時間判斷由 RPC 執行。

Frontend 的時間狀態僅用於 UX。

真正的資料寫入權限由 DB business logic enforcement。

---

# 10. 教官首頁

Phase 1 僅提供可以透過簡單 aggregation 得出的資訊。

例如：

```text
今日回報

30 / 45 班
```

代表：

```text
已回報班級 / 應回報班級
```

以及：

```text
今日缺席
病假 12
事假 8
公假 4
曠課 3
```

若資料模型與需求允許，這些數字可直接由當日最新 submission 計算。

Phase 1 不建立獨立 statistics table。

---

# 11. 班級歷史

教官進入班級後可以查看：

```text
2026/09/11

07:42
07:51
07:58
```

每筆 submission 顯示：

- 提交時間
- 提交者
- 出缺勤 snapshot

因此不需要另外維護：

```text
audit_logs
```

因為 attendance 本身就是 append-only history。

---

# 12. 風紀名單

教官可以查看及管理各班風紀。

資料來源可依校內實際資訊系統決定。

原則：

> 班級與校內人員基本資料由資訊單位維護；本系統只維護完成本系統業務所必要的 mapping。

避免重建一套完整學生資料庫。

---

# 13. 系統設定

採 key-value configuration。

每個設定為獨立資料列。

例如：

```text
attendance.report_start
attendance.report_end
attendance.cooldown_seconds
semester.start_date
semester.end_date
ceremony.date
```

而不是將所有設定放入單一 JSON。

優點：

- 新增設定不需修改 schema
- 每個設定有獨立名稱
- 可由管理介面逐項編輯
- 容易由 Server/RPC 讀取
- 與 VS Code 等工具常見的設定模型一致

---

# 14. Phase 2

Phase 2 再加入：

## 行事曆

- 學年
- 學期
- 國定假日
- 補假
- 補課
- 特殊假日
- 自動判斷應回報日

## 統計

時間尺度：

```text
學年
學期
過去四週
週
日
```

分析維度：

```text
個人
班級
年級
全體
```

Phase 2 統計應建立在 Phase 1 已保存的 append-only attendance snapshot 上，不應要求重建第一期資料模型。