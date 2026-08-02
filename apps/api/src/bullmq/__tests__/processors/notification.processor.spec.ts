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
    it('should process a notification job successfully', async () => {
      const jobData = {
        userId: 'user-1',
        type: 'booking_confirmation' as const,
        title: 'Booking Confirmed',
        body: 'Your appointment has been booked',
        data: { appointmentId: 'appt-1' },
      };

      const mockJob = {
        id: 'job-1',
        data: jobData,
        name: 'send-notification',
      } as Job;

      await expect(processor.process(mockJob)).resolves.toBeUndefined();
    });

    it('should throw error for invalid job data', async () => {
      const mockJob = {
        id: 'job-2',
        data: null,
        name: 'send-notification',
      } as Job;

      await expect(processor.process(mockJob)).rejects.toThrow();
    });
  });
});
