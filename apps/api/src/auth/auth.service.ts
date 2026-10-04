import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '@planity/shared';
import { hashRefreshToken, jwtExpiryToMs } from './utils/refresh-token.util';
import { generateAuthToken, hashAuthToken } from './utils/auth-token.util';
import { NotificationsService } from '../notifications/notifications.service';

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private notifications: NotificationsService
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await argon2.hash(dto.password);
    let user;

    try {
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash,
          name: dto.name,
          role: UserRole.CLIENT,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already in use');
      }

      throw error;
    }

    const tokens = await this.generateTokens(user.id, user.email);

    // Fire-and-forget: never let a mail failure break registration.
    void this.sendVerificationEmail(user.id, user.email, user.name).catch(() => undefined);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        passwordHash: true,
      },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  /**
   * Validates refresh JWT, checks persisted session hash, rotates refresh (delete old + new session).
   */
  async refreshToken(refreshToken: string) {
    let payload: { sub: string; email: string };
    try {
      payload = this.jwtService.verify<{ sub: string; email: string }>(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenHash = hashRefreshToken(refreshToken);
    const session = await this.prisma.refreshTokenSession.findUnique({
      where: { tokenHash },
    });

    if (
      !session ||
      session.userId !== payload.sub ||
      session.revokedAt !== null ||
      session.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, status: true },
    });

    if (!user || user.status !== 'active') {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.refreshTokenSession.delete({ where: { id: session.id } });
      const tokens = await this.signTokenPair(user.id, user.email);
      await this.storeRefreshSession(user.id, tokens.refreshToken, tx);
      return tokens;
    });
  }

  /** Revoke a single refresh session after JWT verification. */
  async logoutWithRefreshToken(refreshToken: string): Promise<void> {
    try {
      const payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
      const tokenHash = hashRefreshToken(refreshToken);
      await this.prisma.refreshTokenSession.deleteMany({
        where: { tokenHash, userId: payload.sub },
      });
    } catch {
      // Invalid or already-rotated token: idempotent logout
    }
  }

  /** Revoke all refresh sessions for the user (e.g. password reset / sign-out everywhere). */
  async logoutAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshTokenSession.deleteMany({
      where: { userId },
    });
  }

  private refreshSessionExpiry(): Date {
    const exp = this.config.get<string>('JWT_REFRESH_EXPIRY', '7d');
    return new Date(Date.now() + jwtExpiryToMs(exp));
  }

  private async signTokenPair(userId: string, email: string) {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRY', '7d'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async storeRefreshSession(
    userId: string,
    refreshToken: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma
  ): Promise<void> {
    const tokenHash = hashRefreshToken(refreshToken);
    const expiresAt = this.refreshSessionExpiry();
    await tx.refreshTokenSession.create({
      data: { userId, tokenHash, expiresAt },
    });
  }

  private async generateTokens(userId: string, email: string) {
    const tokens = await this.signTokenPair(userId, email);
    await this.storeRefreshSession(userId, tokens.refreshToken);
    return tokens;
  }

  // ── Email verification ─────────────────────────────────────────────────

  /** Issue a single-use verification token and email the link. */
  async sendVerificationEmail(userId: string, email: string, name?: string | null) {
    const { raw, hash } = generateAuthToken();
    await this.prisma.emailVerificationToken.create({
      data: { userId, tokenHash: hash, expiresAt: new Date(Date.now() + VERIFY_TOKEN_TTL_MS) },
    });
    const link = `${this.webBaseUrl()}/verify-email?token=${raw}`;
    await this.notifications.sendOnce({
      userId,
      dedupKey: `verify-email:${hash.slice(0, 16)}`,
      type: 'email_verification',
      toEmail: email,
      subject: 'Verify your email',
      html: this.emailTemplate(
        `Hi ${name ?? 'there'},`,
        `Confirm your email address to finish setting up your account.`,
        link,
        'Verify email'
      ),
    });
  }

  /** Resend a verification email. Always succeeds (no account enumeration). */
  async resendVerification(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, emailVerifiedAt: true },
    });
    if (user && !user.emailVerifiedAt) {
      await this.sendVerificationEmail(user.id, user.email, user.name);
    }
  }

  /** Consume a verification token; marks the user verified. */
  async verifyEmail(token: string): Promise<{ verified: true }> {
    const record = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash: hashAuthToken(token) },
    });
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired verification link');
    }
    await this.prisma.$transaction([
      this.prisma.emailVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: record.userId },
        data: { emailVerifiedAt: new Date() },
      }),
    ]);
    return { verified: true };
  }

  // ── Password reset ───────────────────────────────────────────────────────

  /** Email a reset link if the account exists. Always succeeds (no enumeration). */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    });
    if (!user) return;

    const { raw, hash } = generateAuthToken();
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hash,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });
    const link = `${this.webBaseUrl()}/reset-password?token=${raw}`;
    await this.notifications.sendOnce({
      userId: user.id,
      dedupKey: `password-reset:${hash.slice(0, 16)}`,
      type: 'password_reset',
      toEmail: user.email,
      subject: 'Reset your password',
      html: this.emailTemplate(
        `Hi ${user.name ?? 'there'},`,
        `We received a request to reset your password. This link expires in 1 hour. If you didn't request it, you can ignore this email.`,
        link,
        'Reset password'
      ),
    });
  }

  /** Consume a reset token, set the new password, and revoke all sessions. */
  async resetPassword(token: string, newPassword: string): Promise<{ reset: true }> {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashAuthToken(token) },
    });
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset link');
    }
    const passwordHash = await argon2.hash(newPassword);
    await this.prisma.$transaction([
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
    ]);
    // Sign the user out everywhere after a password change.
    await this.logoutAllForUser(record.userId);
    return { reset: true };
  }

  private webBaseUrl(): string {
    return (this.config.get<string>('APP_WEB_BASE_URL') ?? 'http://localhost:8081').replace(
      /\/$/,
      ''
    );
  }

  private emailTemplate(greeting: string, body: string, link: string, cta: string): string {
    return [
      `<p>${greeting}</p>`,
      `<p>${body}</p>`,
      `<p><a href="${link}" style="display:inline-block;padding:12px 20px;background:#161412;color:#FAF8F3;text-decoration:none;border-radius:4px;">${cta}</a></p>`,
      `<p style="color:#6B6560;font-size:13px;">Or paste this link into your browser:<br/><a href="${link}">${link}</a></p>`,
    ].join('');
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status !== 'active') {
      return null;
    }

    return user;
  }
}
