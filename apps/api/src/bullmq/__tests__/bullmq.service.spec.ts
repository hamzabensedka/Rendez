import { Test, TestingModule } from '@nestjs/testing';
import { BullmqService } from '../bullmq.service';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

describe('BullmqService', () => {
  let service: BullmqService;
  let notificationQueue: jest.Mocked<Queue>;
  let availabilityQueue: jest.Mocked<Queue>;
  let scanSimulationQueue: jest.Mocked<Queue>;

  const mockQueue = {
    add: jest.fn(),
    getWaitingCount: jest.fn().mockResolvedValue(0),
    getActiveCount: jest.fn().mockResolvedValue(0),
    getCompletedCount: jest.fn().mockResolvedValue(0),
    getFailedCount: jest.fn().mockResolvedValue(0),
    getDelayedCount: jest.fn().mockResolvedValue(0),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BullmqService,
        {
          provide: getQueueToken('notifications'),
          useValue: mockQueue,
        },
        {
          provide: getQueueToken('availability-cache'),
          useValue: mockQueue,
        },
        {
          provide: getQueueToken('scan-simulation'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<BullmqService>(BullmqService);
    notificationQueue = module.get(getQueueToken('notifications'));
    availabilityQueue = module.get(getQueueToken('availability-cache'));
    scanSimulationQueue = module.get(getQueueToken('scan-simulation'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addNotificationJob', () => {
    it('should add a notification job to the queue', async () => {
      const data = {
        userId: 'user-123',
        title: 'Booking Confirmed',
        body: 'Your appointment has been confirmed.',
      };
      mockQueue.add.mockResolvedValue({ id: 'job-1' });

      const jobId = await service.addNotificationJob(data);

      expect(jobId).toBe('job-1');
      expect(mockQueue.add).toHaveBeenCalledWith('send-notification', data, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
      });
    });
  });

  describe('addAvailabilityCacheJob', () => {
    it('should add an availability cache job to the queue', async () => {
      const data = { businessId: 'biz-456', date: '2025-01-15' };
      mockQueue.add.mockResolvedValue({ id: 'job-2' });

      const jobId = await service.addAvailabilityCacheJob(data);

      expect(jobId).toBe('job-2');
      expect(mockQueue.add).toHaveBeenCalledWith('refresh-availability', data, {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
      });
    });
  });

  describe('addScanSimulationJob', () => {
    it('should add a scan simulation job to the queue', async () => {
      const data = {
        businessId: 'biz-789',
        scanType: 'qr',
        parameters: { tableId: 't1' },
      };
      mockQueue.add.mockResolvedValue({ id: 'job-3' });

      const jobId = await service.addScanSimulationJob(data);

      expect(jobId).toBe('job-3');
      expect(mockQueue.add).toHaveBeenCalledWith('simulate-scan', data, {
        attempts: 1,
      });
    });
  });

  describe('getQueueMetrics', () => {
    it('should return metrics for a given queue', async () => {
      const metrics = await service.getQueueMetrics('notifications');

      expect(metrics).toEqual({
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        delayed: 0,
      });
    });

    it('should throw for unknown queue name', async () => {
      await expect(service.getQueueMetrics('unknown')).rejects.toThrow(
        'Unknown queue: unknown',
      );
    });
  });
});
