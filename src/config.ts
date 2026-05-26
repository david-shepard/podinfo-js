// Plain config object. Reads process.env once at import time.

export const config = {
  port: Number(process.env.PORT) || 3000,
  host: process.env.HOST || "0.0.0.0",
  logLevel: process.env.LOG_LEVEL || "info",
  secretsDir: process.env.SECRETS_DIR || "/etc/secrets",
  message: process.env.MESSAGE || "greetings from podinfo-node",
  version: process.env.APP_VERSION || "0.1.0",
  redisEnabled: process.env.REDIS_ENABLED === 'true',
  redisParams: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },
} as const;

export type Config = typeof config;
export type configKeys = keyof Config;
