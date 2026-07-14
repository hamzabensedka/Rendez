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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService
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
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already in use');
      }

      throw error;
    }

    const tokens = await this.generateTokens(user.id, user.email);

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
      payload = this.jwtService.verify<{ sub: string; email: string }>(
        refreshToken,
        {
          secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        }
      );
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

