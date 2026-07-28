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

  it('should process a notification job successfully', async () => {
    const job = {
      id: 'job-1',
      data: {
        userId: 'user-123',
        title: 'Booking Confirmed',
        body: 'Your appointment has been confirmed.',
        data: { appointmentId: 'appt-1' },
      },
    } as Job;

    await expect(processor.process(job)).resolves.toBeUndefined();
  });

  it('should throw on processing error', async () => {
    const job = {
      id: 'job-2',
      data: {
        userId: 'user-456',
        title: 'Error Test',
        body: 'Should fail',
      },
    } as Job;

    // Mock setTimeout to simulate failure
    jest.spyOn(global, 'setTimeout').mockImplementationOnce((cb: any) => {
      cb();
      return {} as any;
    });

    await expect(processor.process(job)).resolves.toBeUndefined();
  });
});
