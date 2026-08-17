import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async updatePaymentStatus(paymentId: number, status: PaymentStatus) {
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status },
    });
  }

  async sendNotification(paymentId: number) {
    // Implement notification sending logic here
  }
}