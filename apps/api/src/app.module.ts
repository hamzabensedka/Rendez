import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './businesses/businesses.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingModule } from './bookings/booking.module';
import { ReviewModule } from './reviews/review.module';
import { PaymentModule } from './payments/payments.module';
import { BullMQModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    BusinessModule,
    AvailabilityModule,
    BookingModule,
    ReviewModule,
    PaymentModule,
    BullMQModule.forRoot({
      redis: { url: process.env.REDIS_URL },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule,
    TypeOrmModule,
    AuthModule,
    BusinessModule,
    AvailabilityModule,
    BookingModule,
    ReviewModule,
    PaymentModule,
    BullMQModule,
  ],
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
