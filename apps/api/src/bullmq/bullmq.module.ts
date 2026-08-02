import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullmqService } from './bullmq.service';
import { NotificationProcessor } from './processors/notification.processor';
import { AvailabilityProcessor } from './processors/availability.processor';
import { ScanSimulationProcessor } from './processors/scan-simulation.processor';

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
          password: configService.get<string>('REDIS_PASSWORD') || undefined,
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
        },
        defaultJobOptions: {
          removeOnComplete: { age: 3600 * 24 },
          removeOnFail: { age: 3600 * 24 * 7 },
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      }),
    }),
    BullModule.registerQueue(
      { name: 'notification' },
      { name: 'availability-cache' },
      { name: 'scan-simulation' },
    ),
  ],
  providers: [
    BullmqService,
    NotificationProcessor,
    AvailabilityProcessor,
    ScanSimulationProcessor,
  ],
  exports: [BullmqService, BullModule],
})
export class BullmqModule {}
