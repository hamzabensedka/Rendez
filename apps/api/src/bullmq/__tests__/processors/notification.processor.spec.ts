import { Test, TestingModule } from '@nestjs/testing';
import { NotificationProcessor } from '../../processors/notification.processor';
import { Job } from 'bullmq';

describe('NotificationProcessor', () => {
  let processor: NotificationProcessor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationProcessor],
    }).compile();

    processor = module.get<NotificationProcessor>(NotificationProcessor);
  });

  it('should be defined', () => {
    expect(processor).toBeDefined();
  });

  describe('process', () => {
    it('should process a push notification job', async () => {
      const job = {
        id: 'job-1',
        data: {
          userId: 'user-1',
          type: 'push',
          title: 'Appointment Reminder',
          body: 'You have an appointment tomorrow',
        },
        updateProgress: jest.fn().mockResolvedValue(undefined),
      } as unknown as Job;

      await expect(processor.process(job)).resolves.toBeUndefined();
      expect(job.updateProgress).toHaveBeenCalledWith(100);
    });

    it('should process an email notification job', async () => {
      const job = {
        id: 'job-2',
        data: {
          userId: 'user-1',
          type: 'email',
          title: 'Booking Confirmation',
          body: 'Your booking has been confirmed',
        },
        updateProgress: jest.fn().mockResolvedValue(undefined),
      } as unknown as Job;

      await expect(processor.process(job)).resolves.toBeUndefined();
      expect(job.updateProgress).toHaveBeenCalledWith(100);
    });

    it('should throw error for unsupported notification type', async () => {
      const job = {
        id: 'job-3',
        data: {
          userId: 'user-1',
          type: 'sms',
          title: 'Test',
          body: 'Test body',
        },
        updateProgress: jest.fn().mockResolvedValue(undefined),
      } as unknown as Job;

      await expect(processor.process(job)).rejects.toThrow(
        'Unsupported notification type: sms',
      );
    });
  });
});
