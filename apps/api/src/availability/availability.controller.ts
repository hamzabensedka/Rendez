import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import {
  AvailabilityService,
  type AvailabilitySlotsResponse,
} from './availability.service';

@ApiTags('availability')
@Controller('businesses/:businessId/availability')
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Get()
  @ApiOperation({ summary: 'Get available time slots' })
  @ApiQuery({ name: 'serviceVariantId', required: true })
  @ApiQuery({ name: 'date', required: true, example: '2026-01-19' })
  @ApiQuery({ name: 'staffId', required: false })
  async getAvailableSlots(
    @Param('businessId') businessId: string,
    @Query('serviceVariantId') serviceVariantId: string,
    @Query('date') date: string,
    @Query('staffId') staffId?: string
  ): Promise<AvailabilitySlotsResponse> {
    return this.availabilityService.getAvailableSlots(
      businessId,
      date,
      serviceVariantId,
      staffId
    );
  }
}

