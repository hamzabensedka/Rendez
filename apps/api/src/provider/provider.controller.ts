import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { BusinessHoursDTO } from './dto/business-hours.dto';
import { StaffDTO } from './dto/staff.dto';
import { ServicesDTO } from './dto/services.dto';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post('business-hours')
  async createBusinessHours(@Body() businessHoursDTO: BusinessHoursDTO) {
    return this.providerService.createBusinessHours(businessHoursDTO);
  }

  @Get('business-hours')
  async getBusinessHours() {
    return this.providerService.getBusinessHours();
  }

  @Put('business-hours/:id')
  async updateBusinessHours(@Param('id') id: number, @Body() businessHoursDTO: BusinessHoursDTO) {
    return this.providerService.updateBusinessHours(id, businessHoursDTO);
  }

  @Delete('business-hours/:id')
  async deleteBusinessHours(@Param('id') id: number) {
    return this.providerService.deleteBusinessHours(id);
  }

  @Post('staff')
  async createStaff(@Body() staffDTO: StaffDTO) {
    return this.providerService.createStaff(staffDTO);
  }

  @Get('staff')
  async getStaff() {
    return this.providerService.getStaff();
  }

  @Put('staff/:id')
  async updateStaff(@Param('id') id: number, @Body() staffDTO: StaffDTO) {
    return this.providerService.updateStaff(id, staffDTO);
  }

  @Delete('staff/:id')
  async deleteStaff(@Param('id') id: number) {
    return this.providerService.deleteStaff(id);
  }

  @Post('services')
  async createServices(@Body() servicesDTO: ServicesDTO) {
    return this.providerService.createServices(servicesDTO);
  }

  @Get('services')
  async getServices() {
    return this.providerService.getServices();
  }

  @Put('services/:id')
  async updateServices(@Param('id') id: number, @Body() servicesDTO: ServicesDTO) {
    return this.providerService.updateServices(id, servicesDTO);
  }

  @Delete('services/:id')
  async deleteServices(@Param('id') id: number) {
    return this.providerService.deleteServices(id);
  }
}