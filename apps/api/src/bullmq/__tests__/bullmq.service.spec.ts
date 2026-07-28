import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { BullMqService } from '../bullmq.service';

describe('BullMqService', () => {
  let service: BullMqService;
  let notificationQueue: jest.Mocked<Queue>;
  let availabilityCacheQueue: jest.Mocked<Queue>;
  let scanSimulationQueue: jest.Mocked<Queue>;

  beforeEach(async () => {
    notificationQueue = {
      add: jest.fn().mockResolvedValue({ id: 'job-1' }),
      getJob: jest.fn().mockResolvedValue({
        id: 'job-1',
        name: 'send-notification',
        getState: jest.fn().mockResolvedValue('completed'),
        progress: 100,
        data: { userId: 'user-1', type: 'push', title: 'Test', body: 'Test body' },
        failedReason: null,
      }),
    } as any;

    availabilityCacheQueue = {
      add: jest.fn().mockResolvedValue({ id: 'job-2' }),
      getJob: jest.fn().mockResolvedValue(null),
    } as any;

    scanSimulationQueue = {
      add: jest.fn().mockResolvedValue({ id: 'job-3' }),
      getJob: jest.fn().mockResolvedValue(null),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BullMqService,
        {
          provide: getQueueToken('notifications'),
          useValue: notificationQueue,
        },
        {
          provide: getQueueToken('availability-cache'),
          useValue: availabilityCacheQueue,
        },
        {
          provide: getQueueToken('scan-simulation'),
          useValue: scanSimulationQueue,
        },
      ],
    }).compile();

    service = module.get<BullMqService>(BullMqService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addNotificationJob', () => {
    it('should add a notification job to the queue', async () => {
      const data = {
        userId: 'user-1',
        type: 'push' as const,
        title: 'Test',
        body: 'Test body',
      };

      const jobId = await service.addNotificationJob(data);

      expect(notificationQueue.add).toHaveBeenCalledWith('send-notification', data, expect.any(Object));
      expect(jobId).toBe('job-1');
    });
  });

  describe('addAvailabilityCacheRefreshJob', () => {
    it('should add an availability cache refresh job', async () => {
      const data = {
        businessId: 'biz-1',
        forceRefresh: true,
      };

      const jobId = await service.addAvailabilityCacheRefreshJob(data);

      expect(availabilityCacheQueue.add).toHaveBeenCalledWith('refresh-availability-cache', data, expect.any(Object));
      expect(jobId).toBe('job-2');
    });
  });

  describe('addScanSimulationJob', () => {
    it('should add a scan simulation job', async () => {
      const data = {
        businessId: 'biz-1',
        scanType: 'checkin' as const,
      };

      const jobId = await service.addScanSimulationJob(data);

      expect(scanSimulationQueue.add).toHaveBeenCalledWith('run-scan-simulation', data, expect.any(Object));
      expect(jobId).toBe('job-3');
    });
  });

  describe('getJobStatus', () => {
    it('should return job status for a valid queue and job', async () => {
      const status = await service.getJobStatus('notifications', 'job-1');

      expect(notificationQueue.getJob).toHaveBeenCalledWith('job-1');
      expect(status).toEqual({
        id: 'job-1',
        name: 'send-notification',
        status: 'completed',
        progress: 100,
        data: { userId: 'user-1', type: 'push', title: 'Test', body: 'Test body' },
        failedReason: null,
      });
    });

    it('should return null if job not found', async () => {
      notificationQueue.getJob.mockResolvedValueOnce(null);

      const status = await service.getJobStatus('notifications', 'non-existent');

      expect(status).toBeNull();
    });

    it('should throw error for unknown queue', async () => {
      await expect(service.getJobStatus('unknown-queue', 'job-1')).rejects.toThrow(
        'Queue unknown-queue not found',
      );
    });
  });
});
