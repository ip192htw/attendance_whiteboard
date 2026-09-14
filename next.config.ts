import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        authInterrupts: true, // 啟用權限中斷功能
    },
};

export default nextConfig;
