import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@planity/shared';

@ApiTags('businesses')
@Controller('businesses')
export class BusinessesController {
  constructor(private businessesService: BusinessesService) {}

  @Get()
  @ApiOperation({ summary: 'List businesses' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'query', required: false })
  async findAll(@Query('city') city?: string, @Query('query') query?: string) {
    return this.businessesService.findAll(city, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business details' })
  async findOne(@Param('id') id: string) {
    return this.businessesService.findOne(id);
  }

  @Get(':id/services')
  @ApiOperation({ summary: 'Get business services' })
  async getServices(@Param('id') id: string) {
    const business = await this.businessesService.findOne(id);
    return (business as any).services || [];
  }

  @Get(':id/staff')
  @ApiOperation({ summary: 'Get business staff' })
  async getStaff(@Param('id') id: string) {
    const business = await this.businessesService.findOne(id);
    return (business as any).staff || [];
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER_OWNER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create business (provider only)' })
  async create(@Request() req: any, @Body() dto: CreateBusinessDto) {
    return this.businessesService.create(req.user.id, dto);
  }
}
