import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UserRole } from '@planity/shared';
import { RegisterDto } from './dto/register.dto';
import { hashAuthToken } from './utils/auth-token.util';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    refreshTokenSession: {
      create: jest.fn().mockResolvedValue({}),
      findUnique: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    emailVerificationToken: {
      create: jest.fn().mockResolvedValue({}),
      findUnique: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
    },
    passwordResetToken: {
      create: jest.fn().mockResolvedValue({}),
      findUnique: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
    },
    $transaction: jest.fn(async (ops: unknown[]) => Promise.all(ops as never[])),
  };

  const mockNotifications = {
    sendOnce: jest.fn().mockResolvedValue({ id: 'n-1', delivered: true }),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('jwt-token'),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'JWT_REFRESH_SECRET') return 'refresh-secret-at-least-16chars';
      if (key === 'JWT_REFRESH_EXPIRY') return '7d';
      return undefined;
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    const validDto: RegisterDto = {
      email: 'client@example.com',
      name: 'Test Client',
      password: 'password123',
    };

    it('always creates user with role CLIENT', async () => {
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: validDto.email,
        name: validDto.name,
        role: UserRole.CLIENT,
        createdAt: new Date(),
      });

      const result = await service.register(validDto);

      expect(result.user.role).toBe(UserRole.CLIENT);
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: validDto.email,
            name: validDto.name,
            role: UserRole.CLIENT,
          }),
        })
      );
    });

    it('does not allow assigning admin or provider via registration payload', async () => {
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: validDto.email,
        name: validDto.name,
        role: UserRole.CLIENT,
        createdAt: new Date(),
      });

      await service.register(validDto);

      const createCall = mockPrisma.user.create.mock.calls[0][0];
      expect(createCall.data.role).toBe(UserRole.CLIENT);
      expect(createCall.data.role).not.toBe(UserRole.ADMIN);
      expect(createCall.data.role).not.toBe(UserRole.PROVIDER_OWNER);
      expect(createCall.data.role).not.toBe(UserRole.PROVIDER_STAFF);
    });

    it('throws ConflictException when email already in use', async () => {
      const prismaError = new PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.x',
      });
      mockPrisma.user.create.mockRejectedValue(prismaError);

      await expect(service.register(validDto)).rejects.toThrow(ConflictException);
      await expect(service.register(validDto)).rejects.toThrow(/already in use/i);
    });

    it('issues a verification email after registering', async () => {
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: validDto.email,
        name: validDto.name,
        role: UserRole.CLIENT,
        createdAt: new Date(),
      });

      await service.register(validDto);
      // sendVerificationEmail is fire-and-forget; flush the microtask queue.
      await new Promise((r) => setImmediate(r));

      expect(mockPrisma.emailVerificationToken.create).toHaveBeenCalled();
      expect(mockNotifications.sendOnce).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'email_verification', toEmail: validDto.email })
      );
    });
  });

  describe('email verification', () => {
    it('verifyEmail marks the user verified for a valid token', async () => {
      const raw = 'raw-verify-token';
      mockPrisma.emailVerificationToken.findUnique.mockResolvedValue({
        id: 'vt-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 60_000),
        usedAt: null,
      });

      const result = await service.verifyEmail(raw);

      expect(mockPrisma.emailVerificationToken.findUnique).toHaveBeenCalledWith({
        where: { tokenHash: hashAuthToken(raw) },
      });
      expect(result).toEqual({ verified: true });
      const ops = mockPrisma.$transaction.mock.calls[0][0];
      expect(Array.isArray(ops)).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ emailVerifiedAt: expect.any(Date) }),
        })
      );
    });

    it('verifyEmail rejects an expired/used/unknown token', async () => {
      mockPrisma.emailVerificationToken.findUnique.mockResolvedValue(null);
      await expect(service.verifyEmail('nope')).rejects.toThrow(UnauthorizedException);

      mockPrisma.emailVerificationToken.findUnique.mockResolvedValue({
        id: 'vt-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() - 1000),
        usedAt: null,
      });
      await expect(service.verifyEmail('expired')).rejects.toThrow(UnauthorizedException);
    });

    it('resendVerification only emails when the account exists and is unverified', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        name: 'A',
        emailVerifiedAt: null,
      });
      await service.resendVerification('a@b.com');
      expect(mockNotifications.sendOnce).toHaveBeenCalled();

      mockNotifications.sendOnce.mockClear();
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'a@b.com',
        name: 'A',
        emailVerifiedAt: new Date(),
      });
      await service.resendVerification('a@b.com');
      expect(mockNotifications.sendOnce).not.toHaveBeenCalled();

      mockPrisma.user.findUnique.mockResolvedValue(null);
      await service.resendVerification('ghost@b.com');
      expect(mockNotifications.sendOnce).not.toHaveBeenCalled();
    });
  });

  describe('password reset', () => {
    it('forgotPassword emails a reset link only when the account exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'user-1', email: 'a@b.com', name: 'A' });
      await service.forgotPassword('a@b.com');
      expect(mockPrisma.passwordResetToken.create).toHaveBeenCalled();
      expect(mockNotifications.sendOnce).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'password_reset', toEmail: 'a@b.com' })
      );

      mockNotifications.sendOnce.mockClear();
      mockPrisma.passwordResetToken.create.mockClear();
      mockPrisma.user.findUnique.mockResolvedValue(null);
      await service.forgotPassword('ghost@b.com');
      expect(mockPrisma.passwordResetToken.create).not.toHaveBeenCalled();
      expect(mockNotifications.sendOnce).not.toHaveBeenCalled();
    });

    it('resetPassword updates the hash and revokes all sessions', async () => {
      const raw = 'raw-reset-token';
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue({
        id: 'rt-1',
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 60_000),
        usedAt: null,
      });

      const result = await service.resetPassword(raw, 'newpassword123');

      expect(mockPrisma.passwordResetToken.findUnique).toHaveBeenCalledWith({
        where: { tokenHash: hashAuthToken(raw) },
      });
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ passwordHash: expect.any(String) }),
        })
      );
      // logoutAllForUser -> deleteMany on refreshTokenSession
      expect(mockPrisma.refreshTokenSession.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(result).toEqual({ reset: true });
    });

    it('resetPassword rejects an invalid/expired token', async () => {
      mockPrisma.passwordResetToken.findUnique.mockResolvedValue(null);
      await expect(service.resetPassword('bad', 'newpassword123')).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockPrisma.refreshTokenSession.deleteMany).not.toHaveBeenCalled();
    });
  });
});
