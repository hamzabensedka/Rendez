import { Test, TestingModule } from '@nestjs/testing';
import { BullmqService } from '../bullmq.service';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

describe('BullmqService', () => {
  let service: BullmqService;
  let notificationQueue: jest.Mocked<Queue>;
  let availabilityCacheQueue: jest.Mocked<Queue>;
  let scanSimulationQueue: jest.Mocked<Queue>;

  beforeEach(async () => {
    notificationQueue = {
      add: jest.fn().mockResolvedValue({ id: 'test-job-id' }),
      getWaitingCount: jest.fn().mockResolvedValue(0),
      getActiveCount: jest.fn().mockResolvedValue(0),
      getCompletedCount: jest.fn().mockResolvedValue(0),
      getFailedCount: jest.fn().mockResolvedValue(0),
      getDelayedCount: jest.fn().mockResolvedValue(0),
    } as any;

    availabilityCacheQueue = {
      add: jest.fn().mockResolvedValue({ id: 'test-job-id' }),
      getWaitingCount: jest.fn().mockResolvedValue(0),
      getActiveCount: jest.fn().mockResolvedValue(0),
      getCompletedCount: jest.fn().mockResolvedValue(0),
      getFailedCount: jest.fn().mockResolvedValue(0),
      getDelayedCount: jest.fn().mockResolvedValue(0),
    } as any;

    scanSimulationQueue = {
      add: jest.fn().mockResolvedValue({ id: 'test-job-id' }),
      getWaitingCount: jest.fn().mockResolvedValue(0),
      getActiveCount: jest.fn().mockResolvedValue(0),
      getCompletedCount: jest.fn().mockResolvedValue(0),
      getFailedCount: jest.fn().mockResolvedValue(0),
      getDelayedCount: jest.fn().mockResolvedValue(0),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BullmqService,
        { provide: getQueueToken('notification'), useValue: notificationQueue },
        { provide: getQueueToken('availability-cache'), useValue: availabilityCacheQueue },
        { provide: getQueueToken('scan-simulation'), useValue: scanSimulationQueue },
      ],
    }).compile();

    service = module.get<BullmqService>(BullmqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addNotificationJob', () => {
    it('should add a notification job to the queue', async () => {
      const data = {
        userId: 'user-1',
        type: 'booking_confirmation' as const,
        title: 'Booking Confirmed',
        body: 'Your appointment has been booked',
      };

      await service.addNotificationJob(data);

      expect(notificationQueue.add).toHaveBeenCalledWith(
        'send-notification',
        data,
        expect.objectContaining({
          jobId: expect.stringContaining('notification-user-1-booking_confirmation-'),
        }),
      );
    });
  });

  describe('addAvailabilityCacheRefreshJob', () => {
    it('should add an availability cache refresh job', async () => {
      const data = { businessId: 'biz-1', date: '2024-01-15' };

      await service.addAvailabilityCacheJob(data);

      expect(availabilityCacheQueue.add).toHaveBeenCalledWith(
        'refresh-availability-cache',
        data,
        expect.objectContaining({
          jobId: 'availability-cache-biz-1-2024-01-15',
        }),
      );
    });
  });

  describe('addScanSimulationJob', () => {
    it('should add a scan simulation job', async () => {
      const data = { businessId: 'biz-1', scanType: 'full' as const };

      await service.addScanSimulationJob(data);

      expect(scanSimulationQueue.add).toHaveBeenCalledWith(
        'run-scan-simulation',
        data,
        expect.objectContaining({
          jobId: expect.stringContaining('scan-sim-biz-1-'),
        }),
      );
    });
  });

  describe('getQueueMetrics', () => {
    it('should return queue metrics', async () => {
      notificationQueue.getWaitingCount.mockResolvedValue(5);
      notificationQueue.getActiveCount.mockResolvedValue(2);
      notificationQueue.getCompletedCount.mockResolvedValue(100);
      notificationQueue.getFailedCount.mockResolvedValue(3);
      notificationQueue.getDelayedCount.mockResolvedValue(1);

      const metrics = await service.getQueueMetrics('notification');

      expect(metrics).toEqual({
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3,
        delayed: 1,
      });
    });

    it('should throw for unknown queue name', async () => {
      await expect(service.getQueueMetrics('unknown')).rejects.toThrow(
        'Queue unknown not found',
      );
    });
  });
});
