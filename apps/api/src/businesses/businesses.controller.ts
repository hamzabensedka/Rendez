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
import { CreateBusinessDto } from './dto/create-business.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { UserRole } from '@planity/shared';

@ApiTags('businesses')
@Controller('businesses')
export class BusinessesController {
  constructor(private businessesService: BusinessesService) {}

  @Get()
  @ApiOperation({ summary: 'List businesses (paginated)' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'query', required: false })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (1-based)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (max 100)' })
  async findAll(
    @Query('city') city?: string,
    @Query('query') query?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : undefined;
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.businessesService.findAll(city, query, pageNum, limitNum);
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
    return business.services ?? [];
  }

  @Get(':id/staff')
  @ApiOperation({ summary: 'Get business staff' })
  async getStaff(@Param('id') id: string) {
    const business = await this.businessesService.findOne(id);
    return business.staff ?? [];
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
