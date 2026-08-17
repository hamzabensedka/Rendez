import { Module } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { AvailabilityModule } from './availability/availability.module';
import { BusinessesModule } from './businesses/businesses.module';
import { ConfigModule } from './config/config.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PlacesModule } from './places/places.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { ServicesModule } from './services/services.module';
import { UsersModule } from './users/users.module';
import { BullmqModule } from './bullmq/bullmq.module';
import { NotificationModule } from './notifications/notification.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payment/payments.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BusinessHoursModule } from './business-hours/business-hours.module';
import { StaffModule } from './staff/staff.module';

@Module({
  imports: [
    AppointmentsModule,
    AuthModule,
    AvailabilityModule,
    BusinessesModule,
    ConfigModule,
    FavoritesModule,
    PlacesModule,
    PrismaModule,
    RedisModule,
    ServiceCategoriesModule,
    ServicesModule,
    UsersModule,
    BullmqModule,
    NotificationModule,
    NotificationsModule,
    PaymentsModule,
    PaymentModule,
    ReviewsModule,
    BusinessHoursModule,
    StaffModule
  ],
})
export class AppModule {}
