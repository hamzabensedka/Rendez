import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AvailabilityService } from '../availability/availability.service';
import { PaymentService } from '../payment/payment.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  controllers: [BookingController],
  providers: [
    BookingService,
    PrismaService,
    AvailabilityService,
    PaymentService,
    NotificationsService,
  ],
})
export class BookingModule {}