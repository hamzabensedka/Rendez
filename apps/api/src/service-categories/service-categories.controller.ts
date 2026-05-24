import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ServiceCategoriesService } from './service-categories.service';

@ApiTags('service-categories')
@Controller('service-categories')
export class ServiceCategoriesController {
  constructor(private readonly serviceCategoriesService: ServiceCategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List canonical service categories for search filters' })
  async list() {
    const data = await this.serviceCategoriesService.listOrdered();
    return { data };
  }
}
