import { Test } from '@nestjs/testing';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewsService } from './reviews.service';

const user = { id: 'user-1', email: 'a@b.c', name: 'A', role: 'client', status: 'active' };
const completedAppointment = {
  id: 'appt-1',
  clientUserId: 'user-1',
  businessId: 'biz-1',
  status: 'COMPLETED',
};

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prisma: {
    appointment: { findUnique: jest.Mock };
    review: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      appointment: { findUnique: jest.fn() },
      review: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      $transaction: jest.fn(async (ops: unknown[]) => Promise.all(ops as never[])),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [ReviewsService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleRef.get(ReviewsService);
  });

  describe('create', () => {
    const dto = { appointmentId: 'appt-1', rating: 5, comment: 'great' };

    it('creates a pending review derived from the appointment', async () => {
      prisma.appointment.findUnique.mockResolvedValue(completedAppointment);
      prisma.review.create.mockResolvedValue({ id: 'rev-1' });

      await service.create(user, dto);

      expect(prisma.review.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            businessId: 'biz-1',
            clientUserId: 'user-1',
            status: 'pending',
            rating: 5,
          }),
        })
      );
    });

    it('forbids reviewing someone else’s appointment', async () => {
      prisma.appointment.findUnique.mockResolvedValue({
        ...completedAppointment,
        clientUserId: 'someone-else',
      });
      await expect(service.create(user, dto)).rejects.toThrow(ForbiddenException);
    });

    it('rejects non-completed appointments', async () => {
      prisma.appointment.findUnique.mockResolvedValue({
        ...completedAppointment,
        status: 'BOOKED',
      });
      await expect(service.create(user, dto)).rejects.toThrow(ConflictException);
    });

    it('maps the one-review-per-appointment unique violation to 409', async () => {
      prisma.appointment.findUnique.mockResolvedValue(completedAppointment);
      prisma.review.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('unique', {
          code: 'P2002',
          clientVersion: 'test',
        })
      );
      await expect(service.create(user, dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findByBusiness', () => {
    it('only exposes approved reviews and paginates', async () => {
      prisma.review.findMany.mockResolvedValue([]);
      prisma.review.count.mockResolvedValue(0);

      const result = await service.findByBusiness('biz-1', 2, 200);

      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { businessId: 'biz-1', status: 'approved' },
          take: 50,
          skip: 50,
        })
      );
      expect(result.meta).toEqual({ page: 2, limit: 50, total: 0 });
    });
  });

  describe('moderation (admin)', () => {
    it('approves a pending review', async () => {
      prisma.review.findUnique.mockResolvedValue({ id: 'rev-1', status: 'pending' });
      prisma.review.update.mockResolvedValue({ id: 'rev-1', status: 'approved' });

      const result = await service.moderate('rev-1', 'approve');

      expect(prisma.review.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: 'approved' } })
      );
      expect(result.status).toBe('approved');
    });

    it('rejects a review', async () => {
      prisma.review.findUnique.mockResolvedValue({ id: 'rev-1', status: 'pending' });
      prisma.review.update.mockResolvedValue({ id: 'rev-1', status: 'rejected' });

      await service.moderate('rev-1', 'reject');

      expect(prisma.review.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: 'rejected' } })
      );
    });

    it('404s on unknown review id', async () => {
      prisma.review.findUnique.mockResolvedValue(null);
      await expect(service.moderate('nope', 'approve')).rejects.toThrow(NotFoundException);
    });

    it('lists only pending reviews, oldest first, paginated', async () => {
      prisma.review.findMany.mockResolvedValue([]);
      prisma.review.count.mockResolvedValue(0);

      await service.findPending(1, 10);

      expect(prisma.review.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'pending' },
          orderBy: { createdAt: 'asc' },
        })
      );
    });
  });

  describe('update / remove ownership', () => {
    it('forbids editing another user’s review', async () => {
      prisma.review.findUnique.mockResolvedValue({ id: 'rev-1', clientUserId: 'other' });
      await expect(service.update(user, 'rev-1', { rating: 2 })).rejects.toThrow(
        ForbiddenException
      );
    });

    it('forbids deleting another user’s review', async () => {
      prisma.review.findUnique.mockResolvedValue({ id: 'rev-1', clientUserId: 'other' });
      await expect(service.remove(user, 'rev-1')).rejects.toThrow(ForbiddenException);
    });

    it('resets to pending on edit and deletes when owner', async () => {
      prisma.review.findUnique.mockResolvedValue({ id: 'rev-1', clientUserId: 'user-1' });
      prisma.review.update.mockResolvedValue({ id: 'rev-1' });
      await service.update(user, 'rev-1', { rating: 2 });
      expect(prisma.review.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ status: 'pending' }) })
      );

      prisma.review.delete.mockResolvedValue({});
      await expect(service.remove(user, 'rev-1')).resolves.toEqual({ deleted: true });
    });

    it('404s on unknown review id', async () => {
      prisma.review.findUnique.mockResolvedValue(null);
      await expect(service.remove(user, 'nope')).rejects.toThrow(NotFoundException);
    });
  });
});
