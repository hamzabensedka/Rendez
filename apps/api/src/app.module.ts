import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@nestjs/prisma';
import { BullMQModule } from '@nestjs/bullmq';
import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './businesses/businesses.module';
import { AvailabilityModule } from './availability/availability.module';
import { BookingModule } from './booking/booking.module';
import { ReviewModule } from './review/review.module';
import { NotificationModule } from './notification/notification.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    PrismaModule,
    BullMQModule.forRoot({
      imports: [ConfigModule],
      autoLoadTopics: false,
    }),
    AuthModule,
    BusinessModule,
    AvailabilityModule,
    BookingModule,
    ReviewModule,
    NotificationModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
