import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BullMQService } from '../bullmq/bullmq.service';

@Injectable()
export class ReminderEmailJob {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bullMQService: BullMQService
  ) {}

  async execute() {
    // Implement logic to send reminder emails using Prisma and BullMQ
    const appointments = await this.prisma.appointment.findMany({
      where: {
        remindAt: {
          lte: new Date()
        }
      }
    });

    for (const appointment of appointments) {
      await this.bullMQService.add('send-reminder-email', appointment);
    }
  }
}