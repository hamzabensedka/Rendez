import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { NotificationProcessor } from './notification.processor';
import { ResendEmailProvider, StubEmailProvider } from './providers/email.provider';
import { ExpoPushProvider, StubPushProvider } from './providers/push.provider';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST') || 'localhost',
          port: configService.get<number>('REDIS_PORT') || 6379,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'notifications',
    }),
  ],
  providers: [
    NotificationService,
    NotificationProcessor,
    ResendEmailProvider,
    StubEmailProvider,
    ExpoPushProvider,
    StubPushProvider,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
