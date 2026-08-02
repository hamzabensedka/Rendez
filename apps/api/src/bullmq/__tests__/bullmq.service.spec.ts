import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BullmqService } from '../bullmq.service';
import { NotificationJobData } from '../jobs/notification.job';
import { AvailabilityCacheJobData } from '../jobs/availability-cache.job';
import { ScanSimulationJobData } from '../jobs/scan-simulation.job';

describe('BullmqService', () => {
  let service: BullmqService;
  let notificationQueue: jest.Mocked<Queue<NotificationJobData>>;
  let availabilityCacheQueue: jest.Mocked<Queue<AvailabilityCacheJobData>>;
  let scanSimulationQueue: jest.Mocked<Queue<ScanSimulationJobData>>;

  const mockQueue = {
    add: jest.fn(),
    getWaitingCount: jest.fn(),
    getActiveCount: jest.fn(),
    getCompletedCount: jest.fn(),
    getFailedCount: jest.fn(),
    getDelayedCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BullmqService,
        {
          provide: getQueueToken('notification'),
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
    notificationQueue = module.get(getQueueToken('notification'));
    availabilityCacheQueue = module.get(getQueueToken('availability-cache'));
    scanSimulationQueue = module.get(getQueueToken('scan-simulation'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addNotificationJob', () => {
    it('should add a notification job to the queue', async () => {
      const data: NotificationJobData = {
        userId: 'user-1',
        type: 'booking_confirmation',
        payload: { appointmentId: 'appt-1' },
        channels: ['push', 'email'],
      };

      mockQueue.add.mockResolvedValue({ id: 'job-1' });

      const jobId = await service.addNotificationJob(data);

      expect(mockQueue.add).toHaveBeenCalledWith('send-notification', data);
      expect(jobId).toBe('job-1');
    });
  });

  describe('addAvailabilityCacheRefreshJob', () => {
    it('should add an availability cache refresh job', async () => {
      const data: AvailabilityCacheJobData = {
        businessId: 'business-1',
        date: '2025-01-15',
        force: true,
      };

      mockQueue.add.mockResolvedValue({ id: 'job-2' });

      const jobId = await service.addAvailabilityCacheRefreshJob(data);

      expect(mockQueue.add).toHaveBeenCalledWith(
        'refresh-availability-cache',
        data,
      );
      expect(jobId).toBe('job-2');
    });
  });

  describe('addScanSimulationJob', () => {
    it('should add a scan simulation job', async () => {
      const data: ScanSimulationJobData = {
        scanType: 'full',
        parameters: { depth: 3 },
      };

      mockQueue.add.mockResolvedValue({ id: 'job-3' });

      const jobId = await service.addScanSimulationJob(data);

      expect(mockQueue.add).toHaveBeenCalledWith('run-scan-simulation', data);
      expect(jobId).toBe('job-3');
    });
  });

  describe('getQueueMetrics', () => {
    it('should return queue metrics for notification queue', async () => {
      mockQueue.getWaitingCount.mockResolvedValue(5);
      mockQueue.getActiveCount.mockResolvedValue(2);
      mockQueue.getCompletedCount.mockResolvedValue(100);
      mockQueue.getFailedCount.mockResolvedValue(3);
      mockQueue.getDelayedCount.mockResolvedValue(1);

      const metrics = await service.getQueueMetrics('notification');

      expect(metrics).toEqual({
        waiting: 5,
        active: 2,
        completed: 100,
        failed: 3,
        delayed: 1,
      });
    });

    it('should throw error for unknown queue name', async () => {
      await expect(service.getQueueMetrics('unknown')).rejects.toThrow(
        'Unknown queue: unknown',
      );
    });
  });
});
