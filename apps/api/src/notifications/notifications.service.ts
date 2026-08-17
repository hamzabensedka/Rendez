import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BullMQService } from '../bullmq/bullmq.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly bullMQService: BullMQService
  ) {}

  async sendNotification(notification: any) {
    // Send notification logic here
    await this.bullMQService.addNotificationJob(notification);
  }

  async getNotification(id: string) {
    // Get notification logic here
    return this.prismaService.notification.findUnique({
      where: { id }
    });
  }
}
