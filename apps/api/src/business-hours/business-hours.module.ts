import { Module } from '@nestjs/common';
import { BusinessHoursController } from './business-hours.controller';
import { BusinessHoursService } from './business-hours.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessHours } from './entities/business-hours.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessHours])],
  controllers: [BusinessHoursController],
  providers: [BusinessHoursService],
})
export class BusinessHoursModule {}
