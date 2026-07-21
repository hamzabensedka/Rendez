import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationChannel, NotificationType } from './notification-channel.enum';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @HttpCode(HttpStatus.ACCEPTED)
  async sendNotification(@Body() dto: SendNotificationDto) {
    const jobId = await this.notificationService.sendNotification(dto);
    return {
      success: true,
      message: 'Notification queued successfully',
      jobId,
    };
  }

  @Post('booking-confirmation')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  async sendBookingConfirmation(@Body() body: { email: string; bookingData: any }) {
    const jobId = await this.notificationService.sendBookingConfirmation(
      body.email,
      body.bookingData,
    );
    return {
      success: true,
      message: 'Booking confirmation notification queued',
      jobId,
    };
  }

  @Post('booking-reminder')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  async sendBookingReminder(
    @Body()
    body: {
      email: string;
      pushToken?: string;
      bookingData: any;
    },
  ) {
    const jobIds = await this.notificationService.sendBookingReminder(
      body.email,
      body.pushToken,
      body.bookingData,
    );
    return {
      success: true,
      message: 'Booking reminder notifications queued',
      jobIds,
    };
  }

  @Get('queue-stats')
  async getQueueStats() {
    const stats = await this.notificationService.getQueueStats();
    return {
      success: true,
      ...stats,
    };
  }

  @Get('test-confirmation-email')
  @HttpCode(HttpStatus.ACCEPTED)
  async testConfirmationEmail() {
    const jobId = await this.notificationService.sendBookingConfirmation(
      process.env.TEST_EMAIL || 'test@example.com',
      {
        appointmentId: 'test-123',
        businessName: 'Test Salon',
        serviceName: 'Haircut',
        appointmentDate: '2024-01-15',
        appointmentTime: '10:00 AM',
        businessAddress: '123 Test Street, Test City',
        price: 50.00,
      },
    );
    return {
      success: true,
      message: 'Test confirmation email queued',
      jobId,
    };
  }
}
