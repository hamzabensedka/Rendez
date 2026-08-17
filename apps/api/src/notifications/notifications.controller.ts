import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  async sendAppointmentReminder(@Body() appointmentId: number) {
    return this.notificationsService.sendAppointmentReminder(appointmentId);
  }
}
