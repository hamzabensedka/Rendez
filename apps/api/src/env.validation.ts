import * as fs from 'fs';
import * as path from 'path';

const REQUIRED = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'] as const;

function loadEnvFile() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }
    const eq = trimmed.indexOf('=');
    if (eq === -1) {
      continue;
    }
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

export const envSchema = {
  validate() {
    loadEnvFile();

    const missing = REQUIRED.filter((key) => !process.env[key]?.trim());
    if (missing.length) {
      throw new Error(`Missing required env vars: ${missing.join(', ')}. Check apps/api/.env`);
    }

    const accessSecret = process.env.JWT_ACCESS_SECRET ?? '';
    if (accessSecret.length < 16) {
      throw new Error('JWT_ACCESS_SECRET must be at least 16 characters');
    }

    if (!process.env.PORT?.trim()) {
      process.env.PORT = '3000';
    }
  },
};
