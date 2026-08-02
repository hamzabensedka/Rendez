import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { BullModule } from '@nestjs/bull';
import { BullQueueModule } from '@nestjs/bull-queue';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    BullModule.registerQueue('notifications', 100),
    MailerModule.forRoot({
      transport: 'smtps://user:pass@smtp.example.com',
      defaults: {
        from: "'Example' <info@example.com>"
      }
    })
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService]
})
export class NotificationsModule {}
