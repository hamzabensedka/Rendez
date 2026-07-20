import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './auth/auth.module';
import { BusinessesModule } from './businesses/businesses.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AvailabilityModule } from './availability/availability.module';
import { FavoritesModule } from './favorites/favorites.module';
import { NotificationModule } from './notifications/notification.module';
import { ConfigModule } from './config/config.module';
import { Appointment } from './appointments/entities/appointment.entity';
import { Business } from './businesses/entities/business.entity';
import { Service } from './businesses/entities/service.entity';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'planity',
      entities: [User, Business, Service, Appointment],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
    AuthModule,
    BusinessesModule,
    AppointmentsModule,
    AvailabilityModule,
    FavoritesModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
