import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AvailabilityModule } from './availability/availability.module';
import { BullmqModule } from './bullmq/bullmq.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    AuthModule,
    AvailabilityModule,
    BullmqModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
