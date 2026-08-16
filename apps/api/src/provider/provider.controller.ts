import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { BusinessHoursDto } from './dto/business-hours.dto';
import { StaffDto } from './dto/staff.dto';
import { ServicesDto } from './dto/services.dto';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get()
  async getProvider(): Promise<any> {
    return this.providerService.getProvider();
  }

  @Post('business-hours')
  async createBusinessHours(@Body() businessHoursDto: BusinessHoursDto): Promise<any> {
    return this.providerService.createBusinessHours(businessHoursDto);
  }

  @Put('business-hours/:id')
  async updateBusinessHours(@Param('id') id: number, @Body() businessHoursDto: BusinessHoursDto): Promise<any> {
    return this.providerService.updateBusinessHours(id, businessHoursDto);
  }

  @Delete('business-hours/:id')
  async deleteBusinessHours(@Param('id') id: number): Promise<any> {
    return this.providerService.deleteBusinessHours(id);
  }

  @Post('staff')
  async createStaff(@Body() staffDto: StaffDto): Promise<any> {
    return this.providerService.createStaff(staffDto);
  }

  @Put('staff/:id')
  async updateStaff(@Param('id') id: number, @Body() staffDto: StaffDto): Promise<any> {
    return this.providerService.updateStaff(id, staffDto);
  }

  @Delete('staff/:id')
  async deleteStaff(@Param('id') id: number): Promise<any> {
    return this.providerService.deleteStaff(id);
  }

  @Post('services')
  async createServices(@Body() servicesDto: ServicesDto): Promise<any> {
    return this.providerService.createServices(servicesDto);
  }

  @Put('services/:id')
  async updateServices(@Param('id') id: number, @Body() servicesDto: ServicesDto): Promise<any> {
    return this.providerService.updateServices(id, servicesDto);
  }

  @Delete('services/:id')
  async deleteServices(@Param('id') id: number): Promise<any> {
    return this.providerService.deleteServices(id);
  }
}
