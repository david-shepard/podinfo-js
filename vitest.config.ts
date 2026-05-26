// import { defineConfig } from "vitest/config";
// import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { resolve } from "node:path";
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Load env files based on `mode` (e.g., .env.test, .env.ci)
  // empty string '' tells it to load all variables, not just those prefixed with VITE_
  // see: https://vitest.dev/guide/features.html#environment-variables
  const env = loadEnv(mode, process.cwd(), "");

  return {
    test: {
      env: {
        // Merge any dotenv files
        ...env,
        // Overrides so that `vitest run --mode ci` works as expected
        SECRETS_DIR: mode === "ci" ? resolve(__dirname, "secrets") : ""
        // LOG_LEVEL: mode === "local" ? "debug" : "warn",
      },
    },
  };
});
