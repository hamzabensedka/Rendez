import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProviderService } from './provider.service';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Get()
  async findAll(): Promise<any> {
    return this.providerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    return this.providerService.findOne(id);
  }

  @Post()
  async create(@Body() createProviderDto: any): Promise<any> {
    return this.providerService.create(createProviderDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProviderDto: any): Promise<any> {
    return this.providerService.update(id, updateProviderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.providerService.remove(id);
  }
}
