import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send-booking-confirmation-email')
  async sendBookingConfirmationEmail(@Body() bookingDetails: any) {
    await this.notificationsService.sendBookingConfirmationEmail(bookingDetails);
    return { message: 'Email sent successfully' };
  }
}
