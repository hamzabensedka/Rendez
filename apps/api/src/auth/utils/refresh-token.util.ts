import { createHash } from 'crypto';

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

/** Parse Nest/JWT-style expiry like 7d, 15m, 3600s into milliseconds. */
export function jwtExpiryToMs(expiry: string): number {
  const m = expiry.trim().match(/^(\d+)([smhd])$/i);
  if (!m) {
    return 7 * 24 * 60 * 60 * 1000;
  }
  const n = parseInt(m[1], 10);
  const u = m[2].toLowerCase();
  const unitMs =
    u === 's' ? 1000 : u === 'm' ? 60_000 : u === 'h' ? 3_600_000 : 86_400_000;
  return n * unitMs;
}
