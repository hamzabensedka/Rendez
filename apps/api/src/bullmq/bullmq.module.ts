import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { BullmqService } from './bullmq.service';
import { NotificationProcessor } from './processors/notification.processor';
import { AvailabilityProcessor } from './processors/availability.processor';
import { ScanSimulationProcessor } from './processors/scan-simulation.processor';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD', ''),
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
        },
        defaultJobOptions: {
          removeOnComplete: 100,
          removeOnFail: 500,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      }),
      inject: [ConfigService],
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
  exports: [BullmqService],
})
export class BullmqModule {}
