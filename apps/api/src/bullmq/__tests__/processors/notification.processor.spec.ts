import { NotificationProcessor } from '../../processors/notification.processor';
import { Job } from 'bullmq';

describe('NotificationProcessor', () => {
  let processor: NotificationProcessor;

  beforeEach(() => {
    processor = new NotificationProcessor();
  });

  it('should process a notification job successfully', async () => {
    const jobData = {
      userId: 'user-1',
      type: 'booking_confirmation' as const,
      payload: { title: 'Booking Confirmed', body: 'Your appointment is confirmed' },
    };

    const job = {
      id: 'job-1',
      data: jobData,
    } as Job;

    await expect(processor.process(job)).resolves.toBeUndefined();
  });

  it('should handle different notification types', async () => {
    const types = ['booking_confirmation', 'booking_reminder', 'booking_cancellation', 'review_request', 'general'] as const;

    for (const type of types) {
      const jobData = {
        userId: 'user-1',
        type,
        payload: { title: 'Test', body: 'Test body' },
      };

      const job = { id: 'job-1', data: jobData } as Job;
      await expect(processor.process(job)).resolves.toBeUndefined();
    }
  });
});
