import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { CreateServiceVariantDto } from './dto/create-service-variant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@planity/shared';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get('businesses/:businessId')
  @ApiOperation({ summary: 'Get services for a business' })
  async findByBusiness(@Param('businessId') businessId: string) {
    return this.servicesService.findByBusiness(businessId);
  }

  @Post('provider')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER_OWNER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create service (provider only)' })
  async create(
    @Request() req: any,
    @Body() dto: CreateServiceDto & { businessId: string }
  ) {
    return this.servicesService.create(dto.businessId, req.user.id, dto);
  }

  @Post('provider/variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER_OWNER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create service variant (provider only)' })
  async createVariant(
    @Request() req: any,
    @Body() dto: CreateServiceVariantDto & { businessId: string; serviceId: string }
  ) {
    return this.servicesService.createVariant(
      dto.businessId,
      req.user.id,
      dto.serviceId,
      dto
    );
  }
}

