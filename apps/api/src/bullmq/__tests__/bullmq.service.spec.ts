import { Test, TestingModule } from '@nestjs/testing';
import { BullmqService } from '../bullmq.service';
import { getQueueToken } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../bullmq.module';
import { Queue } from 'bullmq';

const mockQueue = {
  add: jest.fn(),
  getJobCounts: jest.fn(),
};

describe('BullmqService', () => {
  let service: BullmqService;
  let notificationQueue: Queue;
  let availabilityQueue: Queue;
  let scanSimulationQueue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BullmqService,
        {
          provide: getQueueToken(QUEUE_NAMES.NOTIFICATION),
          useValue: { ...mockQueue },
        },
        {
          provide: getQueueToken(QUEUE_NAMES.AVAILABILITY_CACHE),
          useValue: { ...mockQueue },
        },
        {
          provide: getQueueToken(QUEUE_NAMES.SCAN_SIMULATION),
          useValue: { ...mockQueue },
        },
      ],
    }).compile();

    service = module.get<BullmqService>(BullmqService);
    notificationQueue = module.get(getQueueToken(QUEUE_NAMES.NOTIFICATION));
    availabilityQueue = module.get(getQueueToken(QUEUE_NAMES.AVAILABILITY_CACHE));
    scanSimulationQueue = module.get(getQueueToken(QUEUE_NAMES.SCAN_SIMULATION));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addNotificationJob', () => {
    it('should add a notification job to the queue', async () => {
      const jobData = {
        userId: 'user-1',
        type: 'booking_confirmation' as const,
        payload: { title: 'Test', body: 'Test body' },
      };

      jest.spyOn(notificationQueue, 'add').mockResolvedValue({ id: 'job-1' } as any);

      const result = await service.addNotificationJob(jobData);

      expect(notificationQueue.add).toHaveBeenCalledWith('send-notification', jobData);
      expect(result).toBe('job-1');
    });
  });

  describe('addAvailabilityCacheJob', () => {
    it('should add an availability cache job to the queue', async () => {
      const jobData = { businessId: 'biz-1', date: '2025-01-01' };

      jest.spyOn(availabilityQueue, 'add').mockResolvedValue({ id: 'job-2' } as any);

      const result = await service.addAvailabilityCacheJob(jobData);

      expect(availabilityQueue.add).toHaveBeenCalledWith('refresh-availability-cache', jobData);
      expect(result).toBe('job-2');
    });
  });

  describe('addScanSimulationJob', () => {
    it('should add a scan simulation job to the queue', async () => {
      const jobData = { businessId: 'biz-1', scanType: 'availability_check' as const };

      jest.spyOn(scanSimulationQueue, 'add').mockResolvedValue({ id: 'job-3' } as any);

      const result = await service.addScanSimulationJob(jobData);

      expect(scanSimulationQueue.add).toHaveBeenCalledWith('run-scan-simulation', jobData);
      expect(result).toBe('job-3');
    });
  });

  describe('getQueueMetrics', () => {
    it('should return job counts for all queues', async () => {
      jest.spyOn(notificationQueue, 'getJobCounts').mockResolvedValue({ waiting: 1, active: 0, completed: 5 });
      jest.spyOn(availabilityQueue, 'getJobCounts').mockResolvedValue({ waiting: 0, active: 1, completed: 3 });
      jest.spyOn(scanSimulationQueue, 'getJobCounts').mockResolvedValue({ waiting: 0, active: 0, completed: 2 });

      const metrics = await service.getQueueMetrics();

      expect(metrics).toEqual({
        notification: { waiting: 1, active: 0, completed: 5 },
        availability: { waiting: 0, active: 1, completed: 3 },
        scanSimulation: { waiting: 0, active: 0, completed: 2 },
      });
    });
  });
});

function getQueueToken(name: string) {
  return `BullQueue_${name}`;
}
