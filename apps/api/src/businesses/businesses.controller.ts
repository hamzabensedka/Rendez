import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { ServicesService } from '../services/services.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { CreateServiceDto } from '../services/dto/create-service.dto';
import { CreateServiceVariantDto } from '../services/dto/create-service-variant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { UserRole } from '@planity/shared';

@ApiTags('businesses')
@Controller('businesses')
export class BusinessesController {
  constructor(
    private businessesService: BusinessesService,
    private servicesService: ServicesService
  ) {}

  @Get()
  @ApiOperation({ summary: 'List businesses (paginated)' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'categories', required: false, description: 'Comma-separated category slugs' })
  @ApiQuery({ name: 'lat', required: false, description: 'User latitude (with lng for near-me bbox)' })
  @ApiQuery({ name: 'lng', required: false, description: 'User longitude' })
  @ApiQuery({ name: 'radiusKm', required: false, description: 'Search radius in km (default 20)' })
  @ApiQuery({
    name: 'availDate',
    required: false,
    description: 'ISO date YYYY-MM-DD — businesses open that weekday (Paris)',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (max 100)' })
  async findAll(
    @Query('city') city?: string,
    @Query('query') query?: string,
    @Query('categories') categories?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radiusKm') radiusKm?: string,
    @Query('availDate') availDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const latNum = lat !== undefined && lat !== '' ? parseFloat(lat) : undefined;
    const lngNum = lng !== undefined && lng !== '' ? parseFloat(lng) : undefined;
    const radiusNum =
      radiusKm !== undefined && radiusKm !== '' ? parseFloat(radiusKm) : undefined;
    return this.businessesService.findAll(city, query, pageNum, limitNum, {
      categories,
      lat: latNum,
      lng: lngNum,
      radiusKm: radiusNum,
      availDate,
    });
  }

  @Get('viewport')
  @ApiOperation({ summary: 'Businesses in map viewport (north, south, east, west)' })
  @ApiQuery({ name: 'north', required: true, description: 'North bound (latitude)' })
  @ApiQuery({ name: 'south', required: true, description: 'South bound (latitude)' })
  @ApiQuery({ name: 'east', required: true, description: 'East bound (longitude)' })
  @ApiQuery({ name: 'west', required: true, description: 'West bound (longitude)' })
  @ApiQuery({ name: 'zoom', required: false, description: 'Zoom level (for future clustering)' })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'categories', required: false, description: 'Comma-separated category slugs' })
  @ApiQuery({ name: 'availDate', required: false })
  async getViewport(
    @Query('north') north: string,
    @Query('south') south: string,
    @Query('east') east: string,
    @Query('west') west: string,
    @Query('zoom') zoom?: string,
    @Query('query') query?: string,
    @Query('category') category?: string,
    @Query('categories') categories?: string,
    @Query('availDate') availDate?: string
  ) {
    const n = parseFloat(north);
    const s = parseFloat(south);
    const e = parseFloat(east);
    const w = parseFloat(west);
    if (Number.isNaN(n) || Number.isNaN(s) || Number.isNaN(e) || Number.isNaN(w)) {
      return { data: [] };
    }
    return this.businessesService.findInViewport({
      north: n,
      south: s,
      east: e,
      west: w,
      zoom: zoom ? parseInt(zoom, 10) : undefined,
      query,
      category,
      categories,
      availDate,
    });
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get business reviews (paginated)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getReviews(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.businessesService.getReviews(id, pageNum, limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business details' })
  async findOne(@Param('id') id: string) {
    return this.businessesService.findOne(id);
  }

  @Get(':id/services')
  @ApiOperation({ summary: 'Get business services' })
  async getServices(@Param('id') id: string) {
    return this.businessesService.listServicesForBusiness(id);
  }

  @Get(':id/staff')
  @ApiOperation({ summary: 'Get business staff' })
  async getStaff(@Param('id') id: string) {
    return this.businessesService.listStaffForBusiness(id);
  }

  @Post(':businessId/services')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER_OWNER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create service for a business (provider owner / admin)' })
  async createService(
    @Param('businessId') businessId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateServiceDto
  ) {
    return this.servicesService.create(businessId, user.id, dto);
  }

  @Post(':businessId/services/:serviceId/variants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER_OWNER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create service variant (provider owner / admin)' })
  async createServiceVariant(
    @Param('businessId') businessId: string,
    @Param('serviceId') serviceId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateServiceVariantDto
  ) {
    return this.servicesService.createVariant(businessId, user.id, serviceId, dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER_OWNER, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create business (provider only)' })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateBusinessDto) {
    return this.businessesService.create(user.id, dto);
  }
}
