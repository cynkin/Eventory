import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "media.assettype.com",
                port: "",         // optional, usually empty unless non-default port
                pathname: "/**",  // wildcard to allow all paths
            },
            {
                protocol: "https",
                hostname: "encrypted-tbn0.gstatic.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;