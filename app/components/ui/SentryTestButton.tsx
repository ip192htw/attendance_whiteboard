"use client";

import * as Sentry from "@sentry/nextjs";

export function SentryTestButton() {
    return (
        <button
            type="button"
            onClick={() => {
                Sentry.captureException(
                    new Error("Sentry production source-map test")
                );
            }}
        >
            Test Sentry
        </button>
    );
}