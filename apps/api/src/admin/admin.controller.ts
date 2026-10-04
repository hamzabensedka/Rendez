import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BillingPlanStatus } from '@prisma/client';
import { UserRole } from '@planity/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AdminService } from './admin.service';
import {
  CreateInvoiceDto,
  MarkInvoicePaidDto,
  UpdateSubscriptionDto,
} from './dto/subscription.dto';

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

  // ── Salon billing (B2B subscriptions) ──────────────────────────────────

  @Get('subscriptions')
  @ApiOperation({ summary: 'List businesses with subscription status (admin)' })
  listSubscriptions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('planStatus') planStatus?: BillingPlanStatus
  ) {
    return this.adminService.listSubscriptions(
      Number(page) || 1,
      Number(limit) || undefined,
      planStatus
    );
  }

  @Patch('subscriptions/:businessId')
  @ApiOperation({ summary: 'Set/transition a business subscription plan (admin)' })
  updateSubscription(@Param('businessId') businessId: string, @Body() dto: UpdateSubscriptionDto) {
    return this.adminService.updateSubscription(businessId, dto);
  }

  @Post('subscriptions/:businessId/invoices')
  @ApiOperation({ summary: 'Create a pending billing-period invoice (admin)' })
  createInvoice(@Param('businessId') businessId: string, @Body() dto: CreateInvoiceDto) {
    return this.adminService.createInvoice(businessId, dto);
  }

  @Post('invoices/:invoiceId/mark-paid')
  @ApiOperation({ summary: 'Manually mark an invoice paid + reactivate (admin)' })
  markInvoicePaid(@Param('invoiceId') invoiceId: string, @Body() dto: MarkInvoicePaidDto) {
    return this.adminService.markInvoicePaid(invoiceId, dto);
  }
}
