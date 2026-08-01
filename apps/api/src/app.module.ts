import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BusinessesModule } from './businesses/businesses.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AvailabilityModule } from './availability/availability.module';
import { BullmqModule } from './bullmq/bullmq.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProviderPortalModule } from './provider-portal/provider-portal.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    BusinessesModule,
    AppointmentsModule,
    AvailabilityModule,
    BullmqModule,
    ProviderPortalModule,
  ],
})
export class AppModule {}
