import { Module, Global, OnModuleInit } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullmqService } from './bullmq.service';
import { NotificationProcessor } from './processors/notification.processor';
import { AvailabilityProcessor } from './processors/availability.processor';
import { ScanSimulationProcessor } from './processors/scan-simulation.processor';

export const QUEUE_NAMES = {
  NOTIFICATION: 'notification',
  AVAILABILITY_CACHE: 'availability-cache',
  SCAN_SIMULATION: 'scan-simulation',
} as const;

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD', ''),
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
        },
      }),
    }),
    BullModule.registerQueue(
      {
        name: QUEUE_NAMES.NOTIFICATION,
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: 100,
          removeOnFail: 500,
        },
      },
      {
        name: QUEUE_NAMES.AVAILABILITY_CACHE,
        defaultJobOptions: {
          attempts: 2,
          backoff: { type: 'fixed', delay: 5000 },
          removeOnComplete: 50,
          removeOnFail: 200,
        },
      },
      {
        name: QUEUE_NAMES.SCAN_SIMULATION,
        defaultJobOptions: {
          attempts: 1,
          removeOnComplete: 10,
          removeOnFail: 50,
        },
      },
    ),
  ],
  providers: [BullmqService, NotificationProcessor, AvailabilityProcessor, ScanSimulationProcessor],
  exports: [BullmqService, BullModule],
})
export class BullmqModule implements OnModuleInit {
  constructor(
    @InjectQueue(QUEUE_NAMES.NOTIFICATION) private readonly notificationQueue: Queue,
    @InjectQueue(QUEUE_NAMES.AVAILABILITY_CACHE) private readonly availabilityQueue: Queue,
    @InjectQueue(QUEUE_NAMES.SCAN_SIMULATION) private readonly scanSimulationQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.notificationQueue.waitUntilReady();
    await this.availabilityQueue.waitUntilReady();
    await this.scanSimulationQueue.waitUntilReady();
    console.log('[BullMQ] All queues ready');
  }
}
