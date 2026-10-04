import { createHash, randomBytes } from 'crypto';

/** Generate a raw single-use token (URL-safe) + its SHA-256 hash for storage. */
export function generateAuthToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString('base64url');
  return { raw, hash: hashAuthToken(raw) };
}

export function hashAuthToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}
