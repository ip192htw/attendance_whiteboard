ALTER TABLE identity.users ENABLE ROW LEVEL SECURITY;


CREATE FUNCTION identity.current_user()
RETURNS identity.users
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = identity
AS $$
    SELECT *
    FROM identity.users
    WHERE auth_user_id = auth.uid()
    LIMIT 1;
$$;

REVOKE ALL ON FUNCTION identity.current_user()
FROM PUBLIC;

GRANT EXECUTE ON FUNCTION identity.current_user()
TO authenticated;

CREATE POLICY "users_select"
ON identity.users
FOR SELECT
TO authenticated
USING (
    email = (identity.current_user()).email
    OR
    (identity.current_user()).role IN ('instructor', 'supervisor')
);

ALTER TABLE attendance.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_select_monitor"
ON attendance.reports
FOR SELECT
TO authenticated
USING (
    class = (identity.current_user()).class
    AND (identity.current_user()).role = 'monitor'
);

CREATE POLICY "reports_select_staff"
ON attendance.reports
FOR SELECT
TO authenticated
USING (
    (identity.current_user()).role IN ('instructor', 'supervisor')
);


REVOKE INSERT ON attendance.reports
FROM authenticated;

GRANT EXECUTE
ON FUNCTION attendance.submit_report(...)
TO authenticated;

ALTER TABLE system.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_select"
ON system.settings
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1
        FROM identity.users
        WHERE auth_user_id = auth.uid()
    )
)
