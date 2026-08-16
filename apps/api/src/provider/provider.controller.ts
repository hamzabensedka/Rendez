import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProviderService } from './provider.service';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get()
  async getBusinesses() {
    return this.providerService.getBusinesses();
  }

  @Get(':id')
  async getBusiness(@Param('id') id: number) {
    return this.providerService.getBusiness(id);
  }

  @Post()
  async createBusiness(@Body() business: any) {
    return this.providerService.createBusiness(business);
  }
}
