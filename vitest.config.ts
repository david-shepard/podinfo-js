import { defineConfig } from "vitest/config";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    env: {
      SECRETS_DIR: resolve(__dirname, "secrets"),
      LOG_LEVEL: "debug",
    },
  },
});
