import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async getServices() {
    return this.servicesService.getServices();
  }

  @Get(':id')
  async getService(@Param('id') id: number) {
    return this.servicesService.getService(id);
  }

  @Post()
  async createService(@Body() service: any) {
    return this.servicesService.createService(service);
  }
}
