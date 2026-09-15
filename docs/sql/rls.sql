ALTER TABLE identity.users ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA identity TO authenticated;
GRANT SELECT ON identity.users TO authenticated;

CREATE OR REPLACE FUNCTION identity.current_user()
RETURNS identity.users
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = identity
AS $$
    SELECT *
    FROM identity.users
    -- 將比對條件改成目前 JWT 裡面登入者的 email
    WHERE email = (auth.jwt() ->> 'email')
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

CREATE POLICY "users_insert"
ON identity.users
FOR INSERT
TO authenticated
WITH CHECK (
    (identity.current_user()).role IN ('instructor', 'supervisor')
);

DROP POLICY IF EXISTS "users_update" ON identity.users;

CREATE POLICY "users_update"
ON identity.users
FOR UPDATE
TO authenticated
USING (
    email = (identity.current_user()).email
    OR ((identity.current_user()).role = 'instructor' AND role = 'monitor')
    OR (identity.current_user()).role = 'supervisor'
);

CREATE OR REPLACE FUNCTION identity.prevent_user_column_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    app_role text := (identity.current_user()).role::text;
BEGIN
    NEW.updated_at := NOW();

    IF app_role NOT IN ('instructor', 'supervisor') THEN
        NEW.email := OLD.email;
        NEW.class := OLD.class;
        NEW.role := OLD.role;
        NEW.created_at := OLD.created_at;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_user_update_restrictions ON identity.users;

CREATE TRIGGER enforce_user_update_restrictions
BEFORE UPDATE ON identity.users
FOR EACH ROW
EXECUTE FUNCTION identity.prevent_user_column_tampering();



ALTER TABLE attendance.reports ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA attendance TO authenticated;
GRANT SELECT ON attendance.reports TO authenticated;

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
GRANT USAGE ON SCHEMA system TO authenticated;
GRANT SELECT ON system.settings TO authenticated;

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


CREATE POLICY "settings_update"
ON system.settings
FOR UPDATE
TO authenticated
USING (
    (identity.current_user()).role IN ('instructor', 'supervisor')
)