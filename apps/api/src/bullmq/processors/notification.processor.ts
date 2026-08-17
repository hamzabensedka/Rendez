import { Processor } from '@nestjs/bull';
import { NotificationsService } from '../notifications/notifications.service';
import { SendAppointmentReminderDto } from '../notifications/dto/send-appointment-reminder.dto';

@Processor('send-appointment-reminder')
export class NotificationProcessor {
  constructor(private readonly notificationsService: NotificationsService) {}

  async handle(job: any) {
    const { userId, businessId, appointmentId } = job.data as SendAppointmentReminderDto;

    // Send notification using Expo Push
    await this.notificationsService.sendPushNotification(userId, businessId, appointmentId);
  }
}
