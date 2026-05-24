import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PlacesService } from './places.service';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Get('suggest')
  @ApiOperation({ summary: 'Address/place suggestions (geocoding proxy)' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({ name: 'limit', required: false, description: 'Max results (default 10)' })
  async suggest(
    @Query('q') q?: string,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.placesService.suggest(q ?? '', isNaN(limitNum) ? 10 : limitNum);
  }
}
