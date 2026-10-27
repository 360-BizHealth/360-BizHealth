import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

/*
 * `npm run dev` serves the React app and runs the real /api handlers in the same
 * process (see server/dev/router.js), reading server secrets from .env. Only
 * VITE_* variables are ever exposed to browser code.
 * (restarted for api router updates)
 */
function localApi(mode) {
  return {
    name: "bh-local-api",
    async configureServer(server) {
      const env = loadEnv(mode, process.cwd(), "");
      for (const [k, v] of Object.entries(env)) if (process.env[k] === undefined) process.env[k] = v;
      if (process.env.ALLOW_INSECURE_COOKIES === undefined) process.env.ALLOW_INSECURE_COOKIES = "true";
      const { createApiMiddleware } = await import("./server/dev/router.js");
      server.middlewares.use(createApiMiddleware(path.resolve("api")));
    },
  };
}

export default defineConfig(({ mode, isSsrBuild }) => ({
  plugins: [react(), localApi(mode)],
  build: {
    sourcemap: false,
    assetsInlineLimit: 2048,
    copyPublicDir: !isSsrBuild,
  },
  /* The SSR bundle (dist-ssr/entry-server.js) is loaded at runtime by the blog
     page function, so it must be self-contained: bundle every dependency. */
  ssr: isSsrBuild && mode !== "test" ? { noExternal: true } : undefined,
  test: {
    include: ["tests/unit/**/*.test.{js,jsx}", "tests/api/**/*.test.js"],
    environment: "node",
    testTimeout: 30000,
    hookTimeout: 120000,
    fileParallelism: false,
  },
}));
