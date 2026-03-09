/**
 * Shape of the JWT access token payload (subject and standard claims).
 * Used by JWT strategy and any code that reads token payloads.
 */
export interface JwtPayload {
  sub: string;
  email?: string;
  iat?: number;
  exp?: number;
}
