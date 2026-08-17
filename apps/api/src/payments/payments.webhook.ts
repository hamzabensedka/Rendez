import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsWebhook {
  constructor(private readonly prisma: PrismaService) {}

  async handleEvent(event: any) {
    // Handle the event here, e.g., update booking status
    await this.prisma.booking.update({
      where: { id: event.bookingId },
      data: { status: event.status },
    });
  }
}