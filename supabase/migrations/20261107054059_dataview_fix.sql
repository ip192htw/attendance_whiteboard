CREATE OR REPLACE VIEW attendance.latest_reports_per_class
WITH (security_invoker = true)
AS
SELECT DISTINCT ON (class, report_date) *
FROM attendance.reports
ORDER BY
    class ASC,
    report_date ASC,
    submitted_at DESC,
    id DESC;