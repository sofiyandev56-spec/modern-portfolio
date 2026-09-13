import type { NextConfig } from "next";

/**
 * GLSL as strings: `import frag from "./shader.frag"` gives the file's source.
 *
 * Next.js 16 bundles with Turbopack, which runs webpack-style loaders through
 * `turbopack.rules`; raw-loader is one of the loaders Vercel tests against it.
 * (Turbopack's native `type: "raw"` module type produced an undefined module
 * on 16.3.4, so the loader stays.) The `webpack` block covers
 * `next build --webpack`, where webpack 5's asset/source type does the same
 * job. Types for the imports live in src/types/glsl.d.ts.
 */
const SHADER_EXTENSIONS = ["glsl", "vert", "frag", "vs", "fs"];

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      [`*.{${SHADER_EXTENSIONS.join(",")}}`]: {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: new RegExp(`\\.(${SHADER_EXTENSIONS.join("|")})$`),
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
