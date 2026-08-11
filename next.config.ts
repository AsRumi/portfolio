import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The OG card renderer reads its TTFs from disk via an absolute runtime path
  // (see src/lib/og.tsx), which the bundler cannot statically detect. Listing the
  // directory here forces it into the serverless output — otherwise share cards
  // render locally but throw "no such file or directory" in production.
  outputFileTracingIncludes: {
    "/**": ["./src/lib/og-fonts/**"],
  },
};

export default nextConfig;
