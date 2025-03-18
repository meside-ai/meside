import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

// import viteReact from '@vitejs/plugin-react'
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
export default defineConfig(({ mode }) => {
  // Load environment variables from .env.production if in production mode,
  // otherwise fall back to .env.default.
  const actualMode =
    mode === "production" && !fs.existsSync(".env.production")
      ? "default"
      : mode;
  const env = loadEnv(actualMode, process.cwd(), "VITE");
  // Merge loaded environment variables into process.env
  process.env = {
    NODE_ENV: process.env.NODE_ENV,
    TZ: process.env.TZ,
    ...env,
  };
  return {
    plugins: [TanStackRouterVite(), react(), svgr()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
        "@meside/shared": path.resolve(import.meta.dirname, "../shared/src"),
      },
    },
    server: {
      proxy: {
        "/meside/api": {
          target: process.env.VITE_API_BASE_URL || "http://127.0.0.1:6333",
          changeOrigin: true,
        },
      },
    },
  };
});
