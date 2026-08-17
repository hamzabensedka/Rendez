import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { StaffModule } from './staff/staff.module';
import { ConfigModule } from './config/config.module';
import { PlacesModule } from './places/places.module';
import { PrismaModule } from './prisma/prisma.module';
import { BullMQModule } from './bullmq/bullmq.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ServicesModule } from './services/services.module';
import { ProviderModule } from './provider/provider.module';
import { FavoritesModule } from './favorites/favorites.module';
import { BusinessesModule } from './businesses/businesses.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AvailabilityModule } from './availability/availability.module';
import { NotificationModule } from './notifications/notification.module';
import { BusinessHoursModule } from './business-hours/business-hours.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';

@Module({
  imports: [UserModule,
    AuthModule,
    RedisModule,
    UsersModule,
    StaffModule,
    ConfigModule,
    PlacesModule,
    PrismaModule,
    BullMQModule,
    PaymentModule,
    ReviewsModule,
    ServicesModule,
    ProviderModule,
    FavoritesModule,
    BusinessesModule,
    AppointmentsModule,
    AvailabilityModule,
    NotificationModule,
    BusinessHoursModule,
    ServiceCategoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}