// ============================================================
// JWT Utility Functions
// ============================================================
// Handles access token (short-lived) and refresh token (long-lived)
// issuance, verification, and cookie management.
// ============================================================

import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me';

// Expiry in seconds
const ACCESS_EXPIRES_SECONDS = 15 * 60; // 15 minutes
const REFRESH_EXPIRES_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload as object, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_SECONDS });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload as object, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_SECONDS });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
}

/**
 * Set refresh token as httpOnly cookie for security.
 * httpOnly + Secure + SameSite=Strict prevents XSS/CSRF attacks.
 */
export function setRefreshTokenCookie(res: any, token: string): void {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth',
  });
}

/**
 * Clear refresh token cookie (logout).
 */
export function clearRefreshTokenCookie(res: any): void {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
  });
}