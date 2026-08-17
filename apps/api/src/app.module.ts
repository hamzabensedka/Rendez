import { Module } from '@nestjs/common';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { AvailabilityModule } from './availability/availability.module';
import { BullmqModule } from './bullmq/bullmq.module';
import { PaymentsModule } from './payment/payments.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentsModule as PaymentsModule2 } from './payments/payments.module';

@Module({
  imports: [
    AppointmentsModule,
    AuthModule,
    AvailabilityModule,
    BullmqModule,
    PaymentsModule,
    PaymentModule,
    PaymentsModule2
  ],
})
export class AppModule {}
