import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotificationChannel } from './notification-channel.enum';
import { EmailService } from './email.service';
import { PushService } from './push.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue('notifications') private readonly queue: Queue,
    private readonly emailService: EmailService,
    private readonly pushService: PushService,
  ) {}

  async sendNotification(notificationChannel: NotificationChannel, data: any) {
    if (notificationChannel === NotificationChannel.EMAIL) {
      await this.emailService.sendEmail(data);
    } else if (notificationChannel === NotificationChannel.PUSH) {
      await this.pushService.sendPushNotification(data);
    }
  }
}