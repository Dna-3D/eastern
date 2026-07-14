// ============================================================
// Auth Routes - Register, Login, Verify, Refresh, Logout
// ============================================================

import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  TokenPayload,
} from '../lib/jwt.js';
import { registerSchema, loginSchema, verifyEmailSchema } from '../lib/validation.js';
import { requireAuth } from '../middleware/auth.js';
import { ConflictError, UnauthorizedError, NotFoundError, AppError } from '../lib/errors.js';

const router = Router();

/**
 * Generate a 6-digit OTP
 */
function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

/**
 * POST /api/auth/register
 * Create account, send email OTP for verification.
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new ConflictError('An account with this email already exists');
    }

    // Check username availability
    const existingUsername = await prisma.profile.findUnique({
      where: { username: data.username },
    });
    if (existingUsername) {
      throw new ConflictError('Username is already taken');
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Generate email OTP
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user + profile in transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          passwordHash,
          emailOtp: otp,
          emailOtpExpiresAt: otpExpiresAt,
          profile: {
            create: {
              displayName: data.displayName,
              username: data.username,
              universityId: data.universityId,
            },
          },
        },
        include: { profile: true },
      });
      return newUser;
    });

    // TODO: Send OTP via Resend email in production
    console.log(`[DEV] OTP for ${data.email}: ${otp}`);

    res.status(201).json({
      success: true,
      message: 'Account created. Please verify your email with the OTP sent.',
      data: { userId: user.id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/verify-email
 * Verify email with OTP.
 */
router.post('/verify-email', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = verifyEmailSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      throw new NotFoundError('User');
    }
    if (user.emailVerified) {
      throw new AppError('Email already verified', 400);
    }
    if (!user.emailOtp || !user.emailOtpExpiresAt) {
      throw new AppError('No OTP sent. Please request a new one.', 400);
    }
    if (user.emailOtpExpiresAt < new Date()) {
      throw new AppError('OTP has expired. Please request a new one.', 400);
    }
    if (user.emailOtp !== data.otp) {
      throw new AppError('Invalid OTP', 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailOtp: null,
        emailOtpExpiresAt: null,
      },
    });

    res.json({
      success: true,
      message: 'Email verified successfully. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Authenticate user and return tokens.
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }
    if (user.deletedAt) {
      throw new UnauthorizedError('This account has been deleted');
    }
    if (user.isBanned) {
      throw new UnauthorizedError('This account has been suspended');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Update last login & streak
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role.toLowerCase(),
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Store refresh token hash in DB for revocation
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    await prisma.refreshToken.create({
      data: {
        token: refreshTokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
          profile: user.profile,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token from cookie or body.
 */
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!token) {
      throw new UnauthorizedError('No refresh token provided');
    }

    // Verify JWT
    let decoded: TokenPayload;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Check if refresh token exists in DB (not revoked)
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: tokenHash,
        userId: decoded.userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!storedToken) {
      throw new UnauthorizedError('Refresh token has been revoked or expired');
    }

    // Revoke old refresh token (rotation)
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Issue new tokens
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true },
    });

    if (!user || user.deletedAt || user.isBanned) {
      throw new UnauthorizedError('Account not available');
    }

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role.toLowerCase(),
    };

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    await prisma.refreshToken.create({
      data: {
        token: newTokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Revoke refresh token and clear cookie.
 */
router.post('/logout', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      await prisma.refreshToken.updateMany({
        where: { token: tokenHash, userId: req.user!.userId },
        data: { revokedAt: new Date() },
      });
    }
    clearRefreshTokenCookie(res);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user.
 */
router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        profile: {
          include: {
            university: true,
            faculty: true,
            department: true,
            hostel: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        role: user.role,
        isStudentVerified: user.isStudentVerified,
        createdAt: user.createdAt,
        profile: user.profile,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;