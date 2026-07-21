import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  async sendNotification(@Body() dto: SendNotificationDto) {
    await this.notificationService.sendNotification(dto);
    return { success: true, message: 'Notification queued successfully' };
  }
}
