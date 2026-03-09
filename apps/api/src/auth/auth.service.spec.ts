import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@planity/shared';
import { RegisterDto } from './dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('token'),
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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
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
      const prismaError = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '5.x',
      });
      mockPrisma.user.create.mockRejectedValue(prismaError);

      await expect(service.register(validDto)).rejects.toThrow(ConflictException);
      await expect(service.register(validDto)).rejects.toThrow(/already in use/i);
    });
  });
});
