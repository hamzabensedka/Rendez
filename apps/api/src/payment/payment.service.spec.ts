import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PaymentService } from './payment.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          id: 'cs_test_123',
          url: 'https://checkout.stripe.com/test',
        }),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  }));
});

describe('PaymentService', () => {
  let service: PaymentService;
  let prisma: PrismaService;

  const mockPrisma = {
    appointment: {
      findUnique: jest.fn(),
    },
    payment: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockConfig = {
    get: jest.fn((key: string) => {
      if (key === 'STRIPE_SECRET_KEY') return 'sk_test_123';
      if (key === 'STRIPE_WEBHOOK_SECRET') return 'whsec_test';
      return undefined;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        { provide: ConfigService, useValue: mockConfig },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCheckoutSession', () => {
    it('should create a checkout session for a confirmed appointment', async () => {
      const appointment = {
        id: 'appt-1',
        userId: 'user-1',
        status: 'CONFIRMED',
        service: { name: 'Haircut', price: 50 },
        business: { name: 'Salon A' },
      };

      mockPrisma.appointment.findUnique.mockResolvedValue(appointment);
      mockPrisma.payment.findFirst.mockResolvedValue(null);
      mockPrisma.payment.create.mockResolvedValue({
        id: 'pay-1',
        providerTxn: 'uuid_123',
        amount: 50,
        status: PaymentStatus.PENDING,
      });

      const result = await service.createCheckoutSession('user-1', {
        appointmentId: 'appt-1',
      });

      expect(result).toHaveProperty('sessionId');
      expect(result).toHaveProperty('url');
      expect(mockPrisma.payment.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            appointmentId: 'appt-1',
            status: PaymentStatus.PENDING,
          }),
        }),
      );
    });

    it('should throw if appointment does not belong to user', async () => {
      mockPrisma.appointment.findUnique.mockResolvedValue({
        id: 'appt-1',
        userId: 'other-user',
        status: 'CONFIRMED',
        service: { name: 'Haircut', price: 50 },
        business: { name: 'Salon A' },
      });

      await expect(
        service.createCheckoutSession('user-1', { appointmentId: 'appt-1' }),
      ).rejects.toThrow('Appointment does not belong to user');
    });

    it('should throw if appointment is already paid', async () => {
      mockPrisma.appointment.findUnique.mockResolvedValue({
        id: 'appt-1',
        userId: 'user-1',
        status: 'CONFIRMED',
        service: { name: 'Haircut', price: 50 },
        business: { name: 'Salon A' },
      });
      mockPrisma.payment.findFirst.mockResolvedValue({
        id: 'pay-1',
        status: PaymentStatus.SUCCEEDED,
      });

      await expect(
        service.createCheckoutSession('user-1', { appointmentId: 'appt-1' }),
      ).rejects.toThrow('Appointment is already paid');
    });
  });

  describe('getPaymentStatus', () => {
    it('should return payment status for appointment', async () => {
      mockPrisma.payment.findFirst.mockResolvedValue({
        id: 'pay-1',
        status: PaymentStatus.SUCCEEDED,
        amount: 50,
      });

      const result = await service.getPaymentStatus('appt-1');
      expect(result).toEqual({ status: PaymentStatus.SUCCEEDED, amount: 50 });
    });

    it('should throw if no payment found', async () => {
      mockPrisma.payment.findFirst.mockResolvedValue(null);

      await expect(service.getPaymentStatus('appt-1')).rejects.toThrow(
        'No payment found for this appointment',
      );
    });
  });
});
