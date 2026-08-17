import { Module } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { AvailabilityModule } from './availability/availability.module';
import { BullMQModule } from './bullmq/bullmq.module';
import { PrismaModule } from './prisma/prisma.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    AppointmentsModule,
    AuthModule,
    AvailabilityModule,
    BullMQModule,
    PrismaModule,
    JobsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
