import { Module } from '@nestjs/common';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { BusinessHoursModule } from '../business-hours/business-hours.module';
import { StaffModule } from '../staff/staff.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [BusinessHoursModule, StaffModule, ServicesModule],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
