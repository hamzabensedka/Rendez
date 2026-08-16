import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { BullQueueService } from './bull-queue.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService, private readonly bullQueueService: BullQueueService) {}

  @Post()
  async sendNotification(@Body() notification: any) {
    await this.bullQueueService.add('notifications', notification);
    return { message: 'Notification sent successfully' };
  }
}
