// import { defineConfig } from "vitest/config";
// import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// export default defineConfig({
//   ci: {
//     env: {
//       SECRETS_DIR: resolve(__dirname, "secrets"),
//       LOG_LEVEL: "debug",
//     },
//   },
// });
import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load env files based on `mode` (e.g., .env.test, .env.ci)
  // empty string '' tells it to load all variables, not just those prefixed with VITE_
  const env = loadEnv(mode, process.cwd(), "");

  return {
    test: {
      env: {
        // Spread the loaded variables into the test environment
        ...env,
        // You can still compute specific overrides here
        SECRETS_DIR: mode === "ci" ? resolve(__dirname, "secrets") : ""
        // LOG_LEVEL: mode === "local" ? "debug" : "warn",
      },
    },
  };
});
