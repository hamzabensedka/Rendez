import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { SetAvailabilityDto } from './dto/set-availability.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class ProviderPortalService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Business helpers ────────────────────────────────────────────
  private async getOwnedBusinessOrFail(ownerId: string) {
    const business = await this.prisma.business.findFirst({
      where: { ownerId },
    });
    if (!business) {
      throw new NotFoundException('No business found for this provider');
    }
    return business;
  }

  private async verifyServiceOwnership(ownerId: string, serviceId: string) {
    const business = await this.getOwnedBusinessOrFail(ownerId);
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, businessId: business.id },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return { business, service };
  }

  private async verifyStaffOwnership(ownerId: string, staffId: string) {
    const business = await this.getOwnedBusinessOrFail(ownerId);
    const staff = await this.prisma.staff.findFirst({
      where: { id: staffId, businessId: business.id },
    });
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }
    return { business, staff };
  }

  // ─── Business Profile ────────────────────────────────────────────
  async getMyBusiness(ownerId: string) {
    return this.getOwnedBusinessOrFail(ownerId);
  }

  async updateBusiness(ownerId: string, dto: UpdateBusinessDto) {
    const business = await this.getOwnedBusinessOrFail(ownerId);
    return this.prisma.business.update({
      where: { id: business.id },
      data: dto,
    });
  }

  // ─── Services CRUD ───────────────────────────────────────────────
  async listServices(ownerId: string) {
    const business = await this.getOwnedBusinessOrFail(ownerId);
    return this.prisma.service.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createService(ownerId: string, dto: CreateServiceDto) {
    const business = await this.getOwnedBusinessOrFail(ownerId);
    return this.prisma.service.create({
      data: {
        ...dto,
        businessId: business.id,
      },
    });
  }

  async updateService(
    ownerId: string,
    serviceId: string,
    dto: UpdateServiceDto,
  ) {
    await this.verifyServiceOwnership(ownerId, serviceId);
    return this.prisma.service.update({
      where: { id: serviceId },
      data: dto,
    });
  }

  async deleteService(ownerId: string, serviceId: string) {
    await this.verifyServiceOwnership(ownerId, serviceId);
    // Check for future appointments using this service
    const futureAppointments = await this.prisma.appointment.findFirst({
      where: {
        serviceId,
        start: { gte: new Date() },
        status: { not: 'CANCELLED' },
      },
    });
    if (futureAppointments) {
      throw new ConflictException(
        'Cannot delete service with upcoming appointments',
      );
    }
    return this.prisma.service.delete({ where: { id: serviceId } });
  }

  // ─── Staff CRUD ──────────────────────────────────────────────────
  async listStaff(ownerId: string) {
    const business = await this.getOwnedBusinessOrFail(ownerId);
    return this.prisma.staff.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createStaff(ownerId: string, dto: CreateStaffDto) {
    const business = await this.getOwnedBusinessOrFail(ownerId);
    return this.prisma.staff.create({
      data: {
        ...dto,
        businessId: business.id,
      },
    });
  }

  async updateStaff(
    ownerId: string,
    staffId: string,
    dto: UpdateStaffDto,
  ) {
    await this.verifyStaffOwnership(ownerId, staffId);
    return this.prisma.staff.update({
      where: { id: staffId },
      data: dto,
    });
  }

  async deleteStaff(ownerId: string, staffId: string) {
    await this.verifyStaffOwnership(ownerId, staffId);
    // Check for future appointments assigned to this staff
    const futureAppointments = await this.prisma.appointment.findFirst({
      where: {
        staffId,
        start: { gte: new Date() },
        status: { not: 'CANCELLED' },
      },
    });
    if (futureAppointments) {
      throw new ConflictException(
        'Cannot delete staff member with upcoming appointments',
      );
    }
    return this.prisma.staff.delete({ where: { id: staffId } });
  }

  // ─── Availability Rules ──────────────────────────────────────────
  async getAvailability(ownerId: string) {
    const business = await this.getOwnedBusinessOrFail(ownerId);
    return this.prisma.availability.findMany({
      where: { businessId: business.id },
      orderBy: [{ weekday: 'asc' }, { start: 'asc' }],
    });
  }

  async setAvailability(ownerId: string, dto: SetAvailabilityDto) {
    const business = await this.getOwnedBusinessOrFail(ownerId);

    // Replace all availability rules for the business in a transaction
    await this.prisma.$transaction(async (tx) => {
      // Delete existing rules
      await tx.availability.deleteMany({
        where: { businessId: business.id },
      });

      // Insert new rules
      if (dto.rules && dto.rules.length > 0) {
        await tx.availability.createMany({
          data: dto.rules.map((rule) => ({
            businessId: business.id,
            weekday: rule.weekday,
            start: rule.start,
            end: rule.end,
            slotLength: rule.slotLength,
          })),
        });
      }
    });

    return this.prisma.availability.findMany({
      where: { businessId: business.id },
      orderBy: [{ weekday: 'asc' }, { start: 'asc' }],
    });
  }

  // ─── Bookings ────────────────────────────────────────────────────
  async listBookings(ownerId: string) {
    const business = await this.getOwnedBusinessOrFail(ownerId);
    return this.prisma.appointment.findMany({
      where: { businessId: business.id },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        service: true,
        staff: true,
      },
      orderBy: { start: 'desc' },
    });
  }

  async getBooking(ownerId: string, bookingId: string) {
    const business = await this.getOwnedBusinessOrFail(ownerId);
    const booking = await this.prisma.appointment.findFirst({
      where: { id: bookingId, businessId: business.id },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        service: true,
        staff: true,
      },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }
}
