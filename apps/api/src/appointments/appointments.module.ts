import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { BusinessesModule } from '../businesses/businesses.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [BusinessesModule, ServicesModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}

