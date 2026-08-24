import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@planity/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('appointments')
  @ApiOperation({ summary: 'Search appointments across businesses (admin)' })
  listAppointments(
    @Query('businessId') businessId?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.adminService.listAppointments({
      businessId: businessId || undefined,
      status: status || undefined,
      from: from || undefined,
      to: to || undefined,
      page: Number(page) || 1,
      limit: Number(limit) || undefined,
    });
  }

  @Get('businesses')
  @ApiOperation({ summary: 'List all businesses including non-active (admin)' })
  listBusinesses(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.adminService.listBusinesses(Number(page) || 1, Number(limit) || undefined);
  }
}
