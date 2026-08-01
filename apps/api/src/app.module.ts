import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BusinessesModule } from './businesses/businesses.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AvailabilityModule } from './availability/availability.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PaymentModule } from './payment/payment.module';
import { BullmqModule } from './bullmq/bullmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    BusinessesModule,
    AppointmentsModule,
    AvailabilityModule,
    ReviewsModule,
    FavoritesModule,
    PaymentModule,
    BullmqModule,
  ],
})
export class AppModule {}
