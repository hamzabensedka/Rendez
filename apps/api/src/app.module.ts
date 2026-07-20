import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './businesses/businesses.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingModule } from './appointments/appointments.module';
import { ReviewModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PaymentsModule } from './payment/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    BusinessModule,
    AvailabilityModule,
    BookingModule,
    ReviewModule,
    FavoritesModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
