import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationService } from './notification.service';
import { NotificationProcessor } from './notification.processor';
import {
  ResendEmailProvider,
  StubEmailProvider,
  EMAIL_PROVIDER,
} from './providers/email.provider';
import {
  ExpoPushProvider,
  StubPushProvider,
  PUSH_PROVIDER,
} from './providers/push.provider';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notifications',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  providers: [
    NotificationService,
    NotificationProcessor,
    {
      provide: EMAIL_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const useStub = configService.get<boolean>('USE_STUB_EMAIL', true);
        return useStub ? new StubEmailProvider() : new ResendEmailProvider(configService);
      },
      inject: [ConfigService],
    },
    {
      provide: PUSH_PROVIDER,
      useFactory: (configService: ConfigService) => {
        const useStub = configService.get<boolean>('USE_STUB_PUSH', true);
        return useStub ? new StubPushProvider() : new ExpoPushProvider(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
