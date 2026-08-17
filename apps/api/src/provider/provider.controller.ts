import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { CreateBusinessHoursDto } from '../business-hours/dto/create-business-hours.dto';
import { CreateStaffDto } from '../staff/dto/create-staff.dto';
import { CreateServiceDto } from '../services/dto/create-service.dto';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post('business-hours')
  createBusinessHours(@Body() createBusinessHoursDto: CreateBusinessHoursDto) {
    return this.providerService.createBusinessHours(createBusinessHoursDto);
  }

  @Post('staff')
  createStaff(@Body() createStaffDto: CreateStaffDto) {
    return this.providerService.createStaff(createStaffDto);
  }

  @Post('services')
  createService(@Body() createServiceDto: CreateServiceDto) {
    return this.providerService.createService(createServiceDto);
  }
}
