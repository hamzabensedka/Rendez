import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationChannel, NotificationType, BookingNotificationData } from './notification-channel.enum';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @UseGuards(JwtAuthGuard)
  async sendNotification(@Body() dto: SendNotificationDto) {
    await this.notificationService.queueNotification(dto);
    return { success: true, message: 'Notification queued successfully' };
  }

  @Post('test/booking-confirmation')
  @UseGuards(JwtAuthGuard)
  async testBookingConfirmation() {
    const testData: BookingNotificationData = {
      appointmentId: 'test-123',
      businessName: 'Test Hair Salon',
      serviceName: 'Haircut',
      dateTime: new Date(Date.now() + 86400000).toISOString(),
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
    };

    await this.notificationService.sendBookingConfirmation(testData);
    return { success: true, message: 'Test booking confirmation sent' };
  }

  @Post('test/booking-reminder')
  @UseGuards(JwtAuthGuard)
  async testBookingReminder() {
    const testData: BookingNotificationData = {
      appointmentId: 'test-456',
      businessName: 'Test Spa',
      serviceName: 'Massage',
      dateTime: new Date(Date.now() + 86400000).toISOString(),
      customerName: 'Jane Doe',
      customerEmail: 'jane.doe@example.com',
    };

    await this.notificationService.sendBookingReminder(testData);
    return { success: true, message: 'Test booking reminder sent' };
  }
}
