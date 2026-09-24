CREATE SCHEMA IF NOT EXISTS identity;

CREATE TYPE identity.user_role AS ENUM (
    'monitor',
    'instructor',
    'supervisor'
);

CREATE TABLE identity.users (
    email TEXT PRIMARY KEY,
    
    auth_user_id UUID UNIQUE
    REFERENCES auth.users(id)
    ON DELETE SET NULL,

    name TEXT NOT NULL,

    role identity.user_role NOT NULL,

    class TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE INDEX users_role_idx
ON identity.users(role);


CREATE SCHEMA IF NOT EXISTS attendance;

CREATE TABLE attendance.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    class TEXT NOT NULL,

    report_date DATE NOT NULL,

    submitted_by TEXT NOT NULL,

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    payload JSONB NOT NULL
);


CREATE INDEX reports_class_date_submitted_idx
ON attendance.reports (
    class,
    report_date DESC,
    submitted_at DESC,
    id DESC
);

CREATE INDEX reports_date_class_submitted_idx
ON attendance.reports (
    report_date,
    class,
    submitted_at DESC
);

CREATE INDEX reports_submitted_by_idx
ON attendance.reports (
    submitted_by,
    submitted_at DESC
);


CREATE SCHEMA IF NOT EXISTS system;

CREATE TABLE system.settings (
    key TEXT PRIMARY KEY,

    value TEXT NOT NULL,

    updated_by TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
