import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { CreateStaffDto } from './dto/create-staff.dto';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post('services')
  createService(@Body() createServiceDto: CreateServiceDto) {
    return this.providerService.createService(createServiceDto);
  }

  @Post('staff')
  createStaff(@Body() createStaffDto: CreateStaffDto) {
    return this.providerService.createStaff(createStaffDto);
  }

  @Get('appointments')
  getAppointments() {
    return this.providerService.getAppointments();
  }
}