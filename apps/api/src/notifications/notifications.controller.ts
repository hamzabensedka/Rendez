import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationChannel } from './notification-channel.enum';
import { Booking } from '../appointments/dto/create-appointment.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send-booking-confirmation')
  async sendBookingConfirmation(
    @Body('notificationChannel') notificationChannel: NotificationChannel,
    @Body('booking') booking: Booking,
  ) {
    await this.notificationsService.sendBookingConfirmation(notificationChannel, booking);
    return { message: 'Booking confirmation sent successfully' };
  }
}