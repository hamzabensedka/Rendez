import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@planity/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ProviderPortalService } from './provider-portal.service';
import {
  AppointmentListQuery,
  CreateStaffDto,
  CreateTimeOffDto,
  ListTimeOffQuery,
  ReplaceAvailabilityRulesDto,
  UpdateAppointmentStatusDto,
  UpdateStaffDto,
} from './dto/provider-portal.dto';

@ApiTags('provider-portal')
@ApiBearerAuth()
@Controller('provider-portal')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PROVIDER_OWNER, UserRole.PROVIDER_STAFF)
export class ProviderPortalController {
  constructor(private readonly portalService: ProviderPortalService) {}

  // ── Availability ──────────────────────────────────────────────────────

  @Get('businesses/:businessId/availability-rules')
  @ApiOperation({ summary: 'List weekly availability rules for a business (optionally per staff)' })
  listAvailabilityRules(
    @CurrentUser() user: AuthenticatedUser,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query('staffId') staffId?: string
  ) {
    return this.portalService.listAvailabilityRules(businessId, staffId);
  }

  @Put('businesses/:businessId/availability-rules')
  @ApiOperation({
    summary: 'Replace the full weekly rule set (business-wide or for one staff member) atomically',
  })
  replaceAvailabilityRules(
    @CurrentUser() user: AuthenticatedUser,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() dto: ReplaceAvailabilityRulesDto
  ) {
    return this.portalService.replaceAvailabilityRules(user, businessId, dto);
  }

  // ── Time off ──────────────────────────────────────────────────────────

  @Get('businesses/:businessId/time-off')
  @ApiOperation({ summary: 'List time off (optionally filter by staff / upcoming only)' })
  listTimeOff(
    @CurrentUser() user: AuthenticatedUser,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query() query: ListTimeOffQuery
  ) {
    return this.portalService.listTimeOff(user, businessId, query);
  }

  @Post('businesses/:businessId/time-off')
  @ApiOperation({ summary: 'Create a time-off window' })
  createTimeOff(
    @CurrentUser() user: AuthenticatedUser,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() dto: CreateTimeOffDto
  ) {
    return this.portalService.createTimeOff(user, businessId, dto);
  }

  @Delete('businesses/:businessId/time-off/:timeOffId')
  @ApiOperation({ summary: 'Delete a time-off window' })
  deleteTimeOff(
    @CurrentUser() user: AuthenticatedUser,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('timeOffId', ParseUUIDPipe) timeOffId: string
  ) {
    return this.portalService.deleteTimeOff(user, businessId, timeOffId);
  }

  // ── Staff ─────────────────────────────────────────────────────────────

  @Get('businesses/:businessId/staff')
  @ApiOperation({ summary: 'List staff (active only unless includeInactive=true)' })
  listStaff(
    @CurrentUser() user: AuthenticatedUser,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query('includeInactive') includeInactive?: string
  ) {
    return this.portalService.listStaff(user, businessId, includeInactive === 'true');
  }

  @Post('businesses/:businessId/staff')
  @ApiOperation({ summary: 'Create a staff member' })
  createStaff(
    @CurrentUser() user: AuthenticatedUser,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Body() dto: CreateStaffDto
  ) {
    return this.portalService.createStaff(user, businessId, dto);
  }

  @Patch('businesses/:businessId/staff/:staffId')
  @ApiOperation({ summary: 'Update / deactivate a staff member' })
  updateStaff(
    @CurrentUser() user: AuthenticatedUser,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Param('staffId', ParseUUIDPipe) staffId: string,
    @Body() dto: UpdateStaffDto
  ) {
    return this.portalService.updateStaff(user, businessId, staffId, dto);
  }

  // ── Appointments ──────────────────────────────────────────────────────

  @Get('businesses/:businessId/appointments')
  @ApiOperation({
    summary: 'List business appointments (status/staff/date filters, paginated)',
  })
  listAppointments(
    @CurrentUser() user: AuthenticatedUser,
    @Param('businessId', ParseUUIDPipe) businessId: string,
    @Query() query: AppointmentListQuery
  ) {
    return this.portalService.listAppointments(user, businessId, query);
  }

  @Patch('appointments/:appointmentId/status')
  @ApiOperation({
    summary:
      'Atomic lifecycle transition of a BOOKED appointment (COMPLETED | NO_SHOW | CANCELLED)',
  })
  updateAppointmentStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
    @Body() dto: UpdateAppointmentStatusDto
  ) {
    return this.portalService.updateAppointmentStatus(user, appointmentId, dto);
  }
}
