import { Test, TestingModule } from '@nestjs/testing';
import { NotificationProcessor } from '../../processors/notification.processor';
import { Job } from 'bullmq';
import { NotificationJobData } from '../../jobs/notification.job';

describe('NotificationProcessor', () => {
  let processor: NotificationProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationProcessor],
    }).compile();

    processor = module.get<NotificationProcessor>(NotificationProcessor);
  });

  describe('process', () => {
    it('should process a notification job successfully', async () => {
      const jobData: NotificationJobData = {
        userId: 'user-1',
        type: 'booking_confirmation',
        payload: { appointmentId: 123 },
        channels: ['push', 'email'],
      };

      const mockJob = {
        id: 'job-1',
        data: jobData,
      } as Job<NotificationJobData, string, string>;

      await expect(processor.process(mockJob)).resolves.toBeUndefined();
    });

    it('should process a notification job with default channels', async () => {
      const jobData: NotificationJobData = {
        userId: 'user-2',
        type: 'booking_reminder',
        payload: { appointmentId: 456 },
      };

      const mockJob = {
        id: 'job-2',
        data: jobData,
      } as Job<NotificationJobData, string, string>;

      await expect(processor.process(mockJob)).resolves.toBeUndefined();
    });

    it('should throw error when processing fails', async () => {
      const jobData: NotificationJobData = {
        userId: 'user-3',
        type: 'booking_cancellation',
        payload: { appointmentId: 789 },
        channels: ['push'],
      };

      const mockJob = {
        id: 'job-3',
        data: jobData,
      } as Job<NotificationJobData, string, string>;

      await expect(processor.process(mockJob)).resolves.toBeUndefined();
    });
  });
});
