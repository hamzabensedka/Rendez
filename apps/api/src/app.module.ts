import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@nestjs/prisma';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './businesses/business.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingModule } from './booking/booking.module';
import { ReviewModule } from './review/review.module';
import { PaymentModule } from './payments/payments.module';
import { NotificationModule } from './notification/notification.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    BusinessModule,
    AvailabilityModule,
    BookingModule,
    ReviewModule,
    PaymentModule,
    NotificationModule,
    AdminModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})

export class AppModule {}
