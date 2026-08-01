import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { SetAvailabilityDto } from './dto/set-availability.dto';
import { UpdateProfileDto } from './dto/update-business.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';

@Injectable()
export class ProviderPortalService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Business helpers ──
  private async getBusinessByOwnerOrThrow(ownerId: string) {
    const business = await this.prisma.business.findFirst({
      where: { ownerId },
    });
    if (!business) {
      throw new NotFoundException('Business not found for this owner');
    }
    return business;
  }

  // ── Business Profile ──
  async getBusinessByOwner(ownerId: string) {
    const business = await this.getBusinessByOwnerOrThrow(ownerId);
    return business;
  }

  async updateBusiness(ownerId: string, dto: UpdateProfileDto) {
    const business = await this.getBusinessByOwnerOrThrow(ownerId);
    return this.prisma.business.update({
      where: { id: business.id },
      data: dto,
    });
  }

  // ── Services ──
  async listServices(ownerId: string) {
    const business = await this.getBusinessByOwnerOrThrow(ownerId);
    return this.prisma.service.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createService(ownerId: string, dto: CreateServiceDto) {
    const business = await this.getBusinessByOwnerOrThrow(ownerId);
    return this.prisma.service.create({
      data: {
        ...dto,
        businessId: business.id,
      },
    });
  }

  async updateService(ownerId: string, serviceId: string, dto: UpdateServiceDto) {
    const business = await this.getBusinessByOwnerOrThrow(ownerId);
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, businessId: business.id },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return this.prisma.service.update({
      where: { id: serviceId },
      data: dto,
    });
  }

  async deleteService(ownerId: string, serviceId: string) {
    const business = await this.getBusinessByOwnerOrThrow(ownerId);
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, businessId: business.id },
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    await this.prisma.service.delete({ where: { id: serviceId } });
  }

  // ── Staff ──
  async listStaff(ownerId: string) {
    const business = await this.getBusinessByOwnerOrThrow(ownerId);
    return this.prisma.staff.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createStaff(ownerId: string, dto: CreateStaffDto) {
    const business = await this.getBusinessByOwnerOrThrow(ownerId);
    return this.prisma.staff.create({
      data: {
        ...dto,
        businessId: business.id,
      },
    });
  }

  async updateStaff(ownerId: string, staffId: string, dto: UpdateStaffDto) {
    const business = await this.getBusinessByOwnerOrThrow(ownerId);
    const staff = await this.prisma.staff.findFirst({
      where: { id: staffId, businessId: business.id },
    });
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }
    return this.prisma.staff.update({
      where: { id: staffId },
      data: dto,
    });
  }

  async deleteStaff(ownerId: string, staffId: string) {
    const business = await this.getBusinessByOwnerOrThrow(ownerId);
    const staff = await this.prisma.staff.findFirst({
      where: { id: staffId, businessId: business.id },
    });
    if (!staff) {
      throw new NotFoundException('Staff member not found');
    }
    await this.prisma.staff.delete({ where: { id: staffId } });
  }

  // ── Availability ──
  async getAvailability(ownerId: string) {
    const business = await this.getBusinessByOwnerOrThrow(ownerId);
    return this.prisma.availability.findMany({
      where: { businessId: business.id },
      orderBy: { weekday: 'asc' },
    });
  }

  async setAvailability(ownerId: string, dto: SetAvailabilityDto) {
    const business = await this.getBusinessByOwnerOrThrow(ownerId);
    // Replace entire availability set for simplicity
    await this.prisma.availability.deleteMany({
      where: { businessId: business.id },
    });
    const data = dto.rules.map((rule) => ({
      businessId: business.id,
      weekday: rule.weekday,
      start: rule.start,
      end: rule.end,
      slotLength: rule.slotLength,
    }));
    await this.prisma.availability.createMany({ data });
    return this.prisma.availability.findMany({
      where: { businessId: business.id },
      orderBy: { weekday: 'asc' },
    });
  }

  // ── Appointments ──
  async listAppointments(ownerId: string, query: AppointmentQueryDto) {
    const business = await this.getBusinessByOwnerOrThrow(ownerId);
    const where: any = { businessId: business.id };

    if (query.status) {
      where.status = query.status;
    }
    if (query.from || query.to) {
      where.start = {};
      if (query.from) where.start.gte = new Date(query.from);
      if (query.to) where.start.lte = new Date(query.to);
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        user: { select: { id: true, email: true, name: true } },
        service: true,
        staff: true,
      },
      orderBy: { start: 'asc' },
    });
  }
}
