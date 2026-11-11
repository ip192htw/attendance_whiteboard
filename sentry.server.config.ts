import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  environment:
    process.env.SENTRY_ENVIRONMENT ??
    process.env.VERCEL_ENV ??
    process.env.NODE_ENV ??
    "development",

  release:
    process.env.SENTRY_RELEASE ??
    `attendance_whiteboard@${
      process.env.VERCEL_GIT_COMMIT_SHA ?? "local"
    }`,

  tracesSampleRate: 1,

  dataCollection: {
    userInfo: false,
    httpBodies: [],
  },
});