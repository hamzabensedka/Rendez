import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { User } from '../../auth/types/authenticated-user.type';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto, user: User): Promise<Payment> {
    return this.prisma.payment.create({
      data: {
        ...createPaymentDto,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async findAll(query: any): Promise<Payment[]> {
    return this.prisma.payment.findMany(query);
  }

  async findOne(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    return this.prisma.payment.update({
      where: {
        id,
      },
      data: updatePaymentDto,
    });
  }

  async remove(id: string): Promise<Payment> {
    return this.prisma.payment.delete({
      where: {
        id,
      },
    });
  }

  async fulfillOrder(id: string): Promise<Payment> {
    const payment = await this.findOne(id);
    if (!payment) {
      throw new NotFoundException();
    }
    return this.update(id, {
      status: 'paid',
    });
  }
}