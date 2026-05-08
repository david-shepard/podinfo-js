import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { config } from './config.js';

// Read on demand so rotated secrets are picked up without restarting.
export function getSecret(name: string): string | null {
  const path = join(config.secretsDir, name);
  if (!existsSync(path)) return null;
  return readFileSync(path, 'utf8').trim();
}

// Returns names only, never values.
export function listSecretNames(): string[] {
  if (!existsSync(config.secretsDir)) return [];
  return readdirSync(config.secretsDir).filter((f) => !f.startsWith('.'));
}
