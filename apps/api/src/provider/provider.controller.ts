import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  async createBusiness(@Body() createBusinessDto: any) {
    return this.providerService.createBusiness(createBusinessDto);
  }

  @Patch(':id')
  async updateBusiness(@Param('id') id: number, @Body() updateBusinessDto: any) {
    return this.providerService.updateBusiness(id, updateBusinessDto);
  }

  @Delete(':id')
  async deleteBusiness(@Param('id') id: number) {
    return this.providerService.deleteBusiness(id);
  }
}
