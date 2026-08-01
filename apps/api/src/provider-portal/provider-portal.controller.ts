import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { ProviderPortalService } from './provider-portal.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';
import { SetAvailabilityDto } from './dto/set-availability.dto';
import { AppointmentsQueryDto } from './dto/appointments-query.dto';

@Controller('provider')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PROVIDER')
export class ProviderPortalController {
  constructor(private readonly providerPortalService: ProviderPortalService) {}

  // ── Business Profile ──
  @Get('business')
  async getMyBusiness(@CurrentUser() user: AuthenticatedUser) {
    return this.providerPortalService.getBusinessByOwner(user.userId);
  }

  @Put('business')
  async updateBusinessProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateBusinessProfileDto,
  ) {
    return this.providerPortalService.updateBusinessProfile(user.userId, dto);
  }

  // ── Services CRUD ──
  @Get('services')
  async listServices(@CurrentUser() user: AuthenticatedUser) {
    return this.providerPortalService.listServices(user.userId);
  }

  @Post('services')
  @HttpCode(HttpStatus.CREATED)
  async createService(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateServiceDto,
  ) {
    return this.providerPortalService.createService(user.userId, dto);
  }

  @Put('services/:serviceId')
  async updateService(
    @CurrentUser() user: AuthenticatedUser,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.providerPortalService.updateService(user.userId, serviceId, dto);
  }

  @Delete('services/:serviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteService(
    @CurrentUser() user: AuthenticatedUser,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ) {
    await this.providerPortalService.deleteService(user.userId, serviceId);
  }

  // ── Staff CRUD ──
  @Get('staff')
  async listStaff(@CurrentUser() user: AuthenticatedUser) {
    return this.providerPortalService.listStaff(user.userId);
  }

  @Post('staff')
  @HttpCode(HttpStatus.CREATED)
  async createStaff(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateStaffDto,
  ) {
    return this.providerPortalService.createStaff(user.userId, dto);
  }

  @Put('staff/:staffId')
  async updateStaff(
    @CurrentUser() user: AuthenticatedUser,
    @Param('staffId', ParseUUIDPipe) staffId: string,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.providerPortalService.updateStaff(user.userId, staffId, dto);
  }

  @Delete('staff/:staffId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStaff(
    @CurrentUser() user: AuthenticatedUser,
    @Param('staffId', ParseUUIDPipe) staffId: string,
  ) {
    await this.providerPortalService.deleteStaff(user.userId, staffId);
  }

  // ── Availability Rules ──
  @Get('availability')
  async getAvailability(@CurrentUser() user: AuthenticatedUser) {
    return this.providerPortalService.getAvailability(user.userId);
  }

  @Put('availability')
  async setAvailability(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SetAvailabilityDto,
  ) {
    return this.providerPortalService.setAvailability(user.userId, dto);
  }

  // ── Appointments ──
  @Get('appointments')
  async getAppointments(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: AppointmentsQueryDto,
  ) {
    return this.providerPortalService.getAppointments(user.userId, query);
  }
}
