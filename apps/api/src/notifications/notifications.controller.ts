import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto, BookingNotificationData } from './dto/send-notification.dto';
import { NotificationChannel, NotificationType } from './notification-channel.enum';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NOTIFICATION_QUEUE, NotificationJobData } from './notification.processor';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectQueue(NOTIFICATION_QUEUE) private readonly notificationQueue: Queue<NotificationJobData>,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('send')
  async sendNotification(
    @Request() req: any,
    @Body() dto: SendNotificationDto,
  ) {
    await this.notificationQueue.add('send-notification', {
      channel: dto.channel,
      type: dto.type,
      email: dto.email,
      pushToken: dto.pushToken,
      userId: dto.userId,
      data: dto.data,
    });

    return { success: true, message: 'Notification queued' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('test-confirmation')
  async testBookingConfirmation(@Request() req: any) {
    const testData: BookingNotificationData = {
      customerName: 'John Doe',
      businessName: 'Test Salon',
      serviceName: 'Haircut',
      appointmentDate: '2024-12-20',
      appointmentTime: '10:00 AM',
      businessAddress: '123 Main St, City',
      businessPhone: '+1 234 567 8900',
    };

    await this.notificationsService.sendBookingConfirmation(
      req.user.email,
      undefined,
      req.user.id,
      testData,
    );

    return { success: true, message: 'Test booking confirmation sent' };
  }
}
