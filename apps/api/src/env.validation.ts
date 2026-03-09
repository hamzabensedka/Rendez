/**
 * Environment validation at startup. Ensures required vars are set and valid
 * so the app fails fast instead of at first request.
 */
function validateEnv(): Record<string, string | number> {
  const errors: string[] = [];

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || typeof databaseUrl !== 'string' || databaseUrl.trim() === '') {
    errors.push('DATABASE_URL is required and must be a non-empty string.');
  } else if (!/^postgres(ql)?:\/\//i.test(databaseUrl)) {
    errors.push('DATABASE_URL must be a valid PostgreSQL connection string (postgres:// or postgresql://).');
  }

  const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
  if (!jwtAccessSecret || typeof jwtAccessSecret !== 'string' || jwtAccessSecret.trim() === '') {
    errors.push('JWT_ACCESS_SECRET is required and must be a non-empty string.');
  } else if (jwtAccessSecret.length < 16) {
    errors.push('JWT_ACCESS_SECRET must be at least 16 characters (use a strong random value).');
  }

  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!jwtRefreshSecret || typeof jwtRefreshSecret !== 'string' || jwtRefreshSecret.trim() === '') {
    errors.push('JWT_REFRESH_SECRET is required and must be a non-empty string.');
  } else if (jwtRefreshSecret.length < 16) {
    errors.push('JWT_REFRESH_SECRET must be at least 16 characters (use a strong random value).');
  }

  const port = process.env.PORT;
  if (port !== undefined && port !== '') {
    const portNum = parseInt(port, 10);
    if (Number.isNaN(portNum) || portNum < 1 || portNum > 65535) {
      errors.push('PORT must be a number between 1 and 65535.');
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}\n\n` +
        'Set required variables in apps/api/.env (see .env.example). Never commit .env or real secrets.'
    );
  }

  return {
    DATABASE_URL: databaseUrl!,
    JWT_ACCESS_SECRET: jwtAccessSecret!,
    JWT_REFRESH_SECRET: jwtRefreshSecret!,
    PORT: port ? parseInt(port, 10) : 3000,
  };
}

export const envSchema = { validate: validateEnv };
