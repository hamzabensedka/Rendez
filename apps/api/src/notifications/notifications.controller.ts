import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async sendNotification(@Body() notification: any) {
    return this.notificationsService.sendNotification(notification);
  }

  @Get(':id')
  async getNotification(@Param('id') id: string) {
    return this.notificationsService.getNotification(id);
  }
}
