CREATE OR REPLACE FUNCTION attendance.validate_report_payload(
    p_payload JSONB
)
RETURNS VOID
LANGUAGE PLPGSQL
IMMUTABLE
AS $$
DECLARE
    v_key TEXT;
    v_value JSONB;
    v_student JSONB;
    v_student_number INTEGER;

    v_seen_students INTEGER[] := ARRAY[]::INTEGER[];
BEGIN
    /*
     * ---------------------------------------------------------
     * 1. Payload itself
     * ---------------------------------------------------------
     */

    IF p_payload IS NULL THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'INVALID_PAYLOAD';
    END IF;

    IF jsonb_typeof(p_payload) <> 'object' THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'INVALID_PAYLOAD';
    END IF;


    /*
     * ---------------------------------------------------------
     * 2. Validate leave types
     * ---------------------------------------------------------
     */

    FOR v_key IN
        SELECT key
        FROM jsonb_object_keys(p_payload) AS key
    LOOP
        IF v_key NOT IN (
            'sick',
            'personal',
            'official',
            'other'
        ) THEN
            RAISE EXCEPTION USING
                ERRCODE = 'P0001',
                MESSAGE = 'INVALID_PAYLOAD',
                DETAIL = v_key;
        END IF;
    END LOOP;


    /*
     * ---------------------------------------------------------
     * 3. Validate each leave-type array
     * ---------------------------------------------------------
     */

    FOR v_key, v_value IN
        SELECT key, value
        FROM jsonb_each(p_payload)
    LOOP

        IF jsonb_typeof(v_value) <> 'array' THEN
            RAISE EXCEPTION USING
                ERRCODE = 'P0001',
                MESSAGE = 'INVALID_PAYLOAD';
        END IF;


        /*
         * Empty arrays are allowed.
         *
         * Example:
         * {
         *   "sick": []
         * }
         */

        FOR v_student IN
            SELECT value
            FROM jsonb_array_elements(v_value)
        LOOP

            /*
             * Student number must be a JSON number.
             */

            IF jsonb_typeof(v_student) <> 'number' THEN
                RAISE EXCEPTION USING
                    ERRCODE = 'P0001',
                    MESSAGE = 'INVALID_PAYLOAD';
            END IF;


            /*
             * JSON number must represent an integer.
             *
             * Reject:
             *   3.5
             *   1e2
             *
             * Accept:
             *   3
             *   100
             */

            IF v_student::TEXT !~ '^[0-9]+$' THEN
                RAISE EXCEPTION USING
                    ERRCODE = 'P0001',
                    MESSAGE = 'INVALID_PAYLOAD';
            END IF;


            v_student_number := v_student::INTEGER;


            /*
             * Student number must be positive.
             */

            IF v_student_number <= 0 THEN
                RAISE EXCEPTION USING
                    ERRCODE = 'P0001',
                    MESSAGE = 'INVALID_PAYLOAD';
            END IF;


            /*
             * A student can only appear once in the
             * entire report.
             */

            IF v_student_number = ANY(v_seen_students) THEN
                RAISE EXCEPTION USING
                    ERRCODE = 'P0001',
                    MESSAGE = 'INVALID_PAYLOAD',
                    DETAIL = v_student_number::TEXT;
            END IF;

            v_seen_students := array_append(
                v_seen_students,
                v_student_number
            );

        END LOOP;

    END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION attendance.submit_report(
    p_payload JSONB
)
RETURNS attendance.reports
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = attendance, identity, system, public
AS $$
DECLARE
    v_user identity.users;

    v_now TIMESTAMPTZ;
    v_local_now TIMESTAMP;
    v_report_date DATE;

    v_start_time TIME;
    v_end_time TIME;
    v_cooldown_seconds INTEGER;
    v_semester_start_date DATE;
    v_semester_end_date DATE;

    v_latest_submitted_at TIMESTAMPTZ;

    v_key TEXT;
    v_value JSONB;
    v_student_number INTEGER;

    v_seen_students INTEGER[] := ARRAY[]::INTEGER[];

    v_report attendance.reports;
BEGIN
    /*
     * ---------------------------------------------------------
     * 2. Resolve current application user
     * ---------------------------------------------------------
     */

    SELECT *
    INTO v_user
    FROM identity.users
    WHERE auth_user_id = auth.uid()
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'UNAUTHORIZED';
    END IF;


    /*
     * ---------------------------------------------------------
     * 3. Only monitor can submit daily reports
     * ---------------------------------------------------------
     */

    IF v_user.role <> 'monitor' THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'NOT_MONITOR';
    END IF;

    IF v_user.class IS NULL THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'INVALID_MONITOR_CLASS';
    END IF;


    /*
     * ---------------------------------------------------------
     * 4. Resolve current DB time
     * ---------------------------------------------------------
     *
     * Use database time instead of client time.
     */

    v_now := now();
    v_local_now := v_now AT TIME ZONE 'Asia/Taipei';
    v_report_date := v_local_now::DATE;


    /*
     * ---------------------------------------------------------
     * 5. Load system settings
     * ---------------------------------------------------------
     */

    SELECT value::DATE
    INTO v_semester_start_date
    FROM system.settings
    WHERE key = 'semester_start_date';

    IF v_semester_start_date IS NULL THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'SETTINGS_NOT_CONFIGURED';
    END IF;

    SELECT value::DATE
    INTO v_semester_end_date
    FROM system.settings
    WHERE key = 'semester_end_date';

    IF v_semester_end_date IS NULL THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'SETTINGS_NOT_CONFIGURED';
    END IF;

    SELECT value::TIME
    INTO v_start_time
    FROM system.settings
    WHERE key = 'report_start_time';

    IF v_start_time IS NULL THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'SETTINGS_NOT_CONFIGURED';
    END IF;


    SELECT value::TIME
    INTO v_end_time
    FROM system.settings
    WHERE key = 'report_end_time';

    IF v_end_time IS NULL THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'SETTINGS_NOT_CONFIGURED';
    END IF;


    SELECT value::INTEGER
    INTO v_cooldown_seconds
    FROM system.settings
    WHERE key = 'report_cooldown_seconds';

    IF v_cooldown_seconds IS NULL THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'SETTINGS_NOT_CONFIGURED';
    END IF;

    IF v_cooldown_seconds < 0 THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'SETTINGS_NOT_CONFIGURED';
    END IF;


    /*
     * ---------------------------------------------------------
     * 6. Check reporting window
     * ---------------------------------------------------------
     *
     * Current version assumes:
     *
     * start_date <= end_date,
     * start_time <= end_time
     *
     * and the reporting window does not cross midnight.
     */

    IF v_report_date < v_semester_start_date
    OR v_report_date > v_semester_end_date
    THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'REPORT_NOT_ALLOWED';
    END IF;

    IF EXTRACT(ISODOW FROM v_report_date) IN (6, 7) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'REPORT_NOT_ALLOWED';
    END IF;

    IF v_local_now::TIME < v_start_time
    OR v_local_now::TIME > v_end_time
    THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'REPORT_NOT_ALLOWED';
    END IF;


    /*
     * ---------------------------------------------------------
     * 7. Lock this monitor's submission path
     * ---------------------------------------------------------
     *
     * Prevent concurrent requests from both passing the
     * cooldown check and inserting reports.
     *
     * Advisory lock key is based on the current user's
     * auth UUID.
     */

    PERFORM pg_advisory_xact_lock(
        hashtextextended(auth.uid()::TEXT, 0)
    );


    /*
     * ---------------------------------------------------------
     * 8. Check cooldown
     * ---------------------------------------------------------
     */

    SELECT submitted_at
    INTO v_latest_submitted_at
    FROM attendance.reports
    WHERE class = v_user.class
      AND report_date = v_report_date
    ORDER BY submitted_at DESC
    LIMIT 1;

    IF FOUND
       AND v_latest_submitted_at
            + make_interval(secs => v_cooldown_seconds)
            > v_now
    THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'REPORT_COOLDOWN';
    END IF;

    /*
     * ---------------------------------------------------------
     * 9. Validate payload
     * ---------------------------------------------------------
     */

    PERFORM attendance.validate_report_payload(
        p_payload
    );


    /*
     * ---------------------------------------------------------
     * 10. Insert immutable report snapshot
     * ---------------------------------------------------------
     */

    INSERT INTO attendance.reports (
        class,
        report_date,
        submitted_by,
        submitted_at,
        payload
    )
    VALUES (
        v_user.class,
        v_report_date,
        v_user.name,
        v_now,
        p_payload
    )
    RETURNING *
    INTO v_report;


    /*
     * ---------------------------------------------------------
     * 11. Return inserted report
     * ---------------------------------------------------------
     */

    RETURN v_report;

END;
$$;


/*
 * -------------------------------------------------------------
 * Permissions
 * -------------------------------------------------------------
 *
 * Never leave the function executable by PUBLIC.
 */

REVOKE ALL
ON FUNCTION attendance.submit_report(JSONB)
FROM PUBLIC;

REVOKE ALL
ON FUNCTION attendance.submit_report(JSONB)
FROM anon;

GRANT EXECUTE
ON FUNCTION attendance.submit_report(JSONB)
TO authenticated;

CREATE OR REPLACE FUNCTION attendance.correct_report(
    p_class INTEGER,
    p_report_date DATE,
    p_payload JSONB
)
RETURNS attendance.reports
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = attendance, identity, system, public
AS $$
DECLARE
    v_user identity.users;

    v_now TIMESTAMPTZ;

    v_report attendance.reports;
BEGIN
    /*
     * ---------------------------------------------------------
     * 1. Resolve current application user
     * ---------------------------------------------------------
     */

    SELECT *
    INTO v_user
    FROM identity.users
    WHERE auth_user_id = auth.uid()
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'UNAUTHORIZED';
    END IF;


    /*
     * ---------------------------------------------------------
     * 2. Only instructor / supervisor can correct reports
     * ---------------------------------------------------------
     */

    IF v_user.role NOT IN (
        'instructor',
        'supervisor'
    ) THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'UNAUTHORIZED';
    END IF;


    /*
     * ---------------------------------------------------------
     * 3. Validate target class
     * ---------------------------------------------------------
     */

    IF p_class IS NULL OR p_class <= 0 THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'INVALID_CLASS';
    END IF;


    /*
     * ---------------------------------------------------------
     * 4. Validate target date
     * ---------------------------------------------------------
     *
     * We do not allow creating a correction for a future date.
     */

    IF p_report_date IS NULL THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'INVALID_REPORT_DATE';
    END IF;

    v_now := now();

    IF p_report_date > v_now::DATE THEN
        RAISE EXCEPTION USING
            ERRCODE = 'P0001',
            MESSAGE = 'INVALID_REPORT_DATE';
    END IF;


    /*
     * ---------------------------------------------------------
     * 5. Validate payload
     * ---------------------------------------------------------
     */

    PERFORM attendance.validate_report_payload(
        p_payload
    );


    /*
     * ---------------------------------------------------------
     * 6. Insert correction as a new immutable snapshot
     * ---------------------------------------------------------
     *
     * No UPDATE.
     * No DELETE.
     *
     * The corrected state becomes the latest report for
     * this class/date.
     */

    INSERT INTO attendance.reports (
        class,
        report_date,
        submitted_by,
        submitted_at,
        payload
    )
    VALUES (
        p_class,
        p_report_date,
        v_user.email,
        v_now,
        p_payload
    )
    RETURNING *
    INTO v_report;


    /*
     * ---------------------------------------------------------
     * 7. Return inserted report
     * ---------------------------------------------------------
     */

    RETURN v_report;

END;
$$;


/*
 * -------------------------------------------------------------
 * Permissions
 * -------------------------------------------------------------
 */

REVOKE ALL
ON FUNCTION attendance.correct_report(INTEGER, DATE, JSONB)
FROM PUBLIC;

REVOKE ALL
ON FUNCTION attendance.correct_report(INTEGER, DATE, JSONB)
FROM anon;

GRANT EXECUTE
ON FUNCTION attendance.correct_report(INTEGER, DATE, JSONB)
TO authenticated;


CREATE OR REPLACE FUNCTION attendance.get_class_history(
    p_class TEXT,
    p_before DATE DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS SETOF attendance.reports
LANGUAGE SQL
STABLE
SECURITY INVOKER
SET search_path = attendance
AS $$
    SELECT DISTINCT ON (r.report_date)
        r.*
    FROM attendance.reports AS r
    WHERE r.class = p_class
      AND r.report_date < COALESCE(
          p_before,
          (now() AT TIME ZONE 'Asia/Taipei')::date
      )
    ORDER BY
        r.report_date DESC,
        r.submitted_at DESC,
        r.id DESC
    LIMIT p_limit;
$$;

/*
 * -------------------------------------------------------------
 * Permissions
 * -------------------------------------------------------------
 */

REVOKE ALL
ON FUNCTION attendance.get_class_history(TEXT, DATE, INTEGER)
FROM PUBLIC;

REVOKE ALL
ON FUNCTION attendance.get_class_history(TEXT, DATE, INTEGER)
FROM anon;

GRANT EXECUTE
ON FUNCTION attendance.get_class_history(TEXT, DATE, INTEGER)
TO authenticated;