import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { NotificationProcessor } from './processors/notification.processor';
import { AvailabilityProcessor } from './processors/availability.processor';
import { ScanSimulationProcessor } from './processors/scan-simulation.processor';
import { BullMqService } from './bullmq.service';

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
          db: configService.get<number>('REDIS_DB', 0),
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: 100,
          removeOnFail: 500,
        },
      }),
    }),
    BullModule.registerQueue(
      { name: 'notifications' },
      { name: 'availability-cache' },
      { name: 'scan-simulation' },
    ),
  ],
  providers: [
    NotificationService,
    AvailabilityProcessor,
    ScanSimulationProcessor,
    BullMqService,
  ],
  exports: [BullMqService, BullModule],
})
export class BullMqModule {}
