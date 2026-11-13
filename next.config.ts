import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

import { EventEmitter } from 'events';

// 將 Node.js EventEmitter 的預設上限從 10 提高至 25
EventEmitter.defaultMaxListeners = 25;

// V8: baseline security headers. Tune the CSP to the exact third parties you
// load (Google sign-in button styles, Vercel analytics). Start in
// Report-Only if you need to observe violations before enforcing.
const securityHeaders = [
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
    experimental: {
        authInterrupts: true, // 啟用權限中斷功能
        serverActions: {
            bodySizeLimit: "5.1mb",
        },
    },
    async headers() {
        return [{ source: "/:path*", headers: securityHeaders }];
    },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/sourcemaps/uploading/bundler-plugin-options/

  org: process.env.SENTRY_ORG || "ip192htw",

  project: process.env.SENTRY_PROJECT || "attendance_whiteboard",

  // Only print logs for uploading source maps in CI
  silent: false, // !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
