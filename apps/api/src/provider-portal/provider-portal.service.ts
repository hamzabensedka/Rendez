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
import { UpdateBusinessProfileDto } from './dto/update-business-profile.dto';
import { SetAvailabilityDto } from './dto/set-availability.dto';
import { AppointmentsQueryDto } from './dto/appointments-query.dto';

@Injectable()
export class ProviderPortalService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Business Profile ──
  async getBusinessByOwner(ownerId: string) {
    const business = await this.prisma.business.findFirst({
      where: { ownerId },
      include: {
        category: true,
        services: true,
        staff: true,
        availability: true,
      },
    });
    if (!business) {
      throw new NotFoundException('No business found for this provider');
    }
    return business;
  }

  async updateBusinessProfile(ownerId: string, dto: UpdateBusinessProfileDto) {
    const business = await this.prisma.business.findFirst({
      where: { ownerId },
    });
    if (!business) {
      throw new NotFoundException('No business found for this provider');
    }
    return this.prisma.business.update({
      where: { id: business.id },
      data: {
        name: dto.name,
        description: dto.description,
        address: dto.address,
        phone: dto.phone,
        website: dto.website,
        categoryId: dto.categoryId,
        ...(dto.latitude !== undefined &&
          dto.longitude !== undefined && {
            location: {
              set: {
                coordinates: [dto.longitude, dto.latitude],
              },
            },
          }),
      },
    });
  }

  // ── Services ──
  async listServices(ownerId: string) {
    const business = await this.getBusinessByOwner(ownerId);
    return this.prisma.service.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createService(ownerId: string, dto: CreateServiceDto) {
    const business = await this.getBusinessByOwner(ownerId);
    return this.prisma.service.create({
      data: {
        businessId: business.id,
        name: dto.name,
        description: dto.description,
        duration: dto.duration,
        price: dto.price,
        categoryId: dto.categoryId,
      },
    });
  }

  async updateService(
    ownerId: string,
    serviceId: string,
    dto: UpdateServiceDto,
  ) {
    await this.ensureServiceBelongsToOwner(ownerId, serviceId);
    return this.prisma.service.update({
      where: { id: serviceId },
      data: {
        name: dto.name,
        description: dto.description,
        duration: dto.duration,
        price: dto.price,
        categoryId: dto.categoryId,
      },
    });
  }

  async deleteService(ownerId: string, serviceId: string) {
    await this.ensureServiceBelongsToOwner(ownerId, serviceId);
    // Prevent deletion if service has future appointments
    const futureAppointments = await this.prisma.appointment.count({
      where: {
        serviceId,
        start: { gte: new Date() },
        status: { not: 'CANCELLED' },
      },
    });
    if (futureAppointments > 0) {
      throw new ConflictException(
        'Cannot delete service with upcoming appointments',
      );
    }
    await this.prisma.service.delete({ where: { id: serviceId } });
  }

  private async assertServiceBelongsToOwner(
    ownerId: string,
    serviceId: string,
  ) {
    const business = await this.getBusinessByOwner(ownerId);
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service || service.businessId !== business.id) {
      throw new ForbiddenException('Service does not belong to your business');
    }
  }

  // ── Staff ──
  async listStaff(ownerId: string) {
    const business = await this.getBusinessByOwner(ownerId);
    return this.prisma.staff.findMany({
      where: { businessId: business.id },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createStaff(ownerId: string, dto: CreateStaffDto) {
    const business = await this.getBusinessByOwner(ownerId);
    return this.prisma.staff.create({
      data: {
        businessId: business.id,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        role: dto.role,
        color: dto.color,
      },
    });
  }

  async updateStaff(ownerId: string, staffId: string, dto: UpdateStaffDto) {
    await this.assertStaffBelongsToOwner(ownerId, staffId);
    return this.prisma.staff.update({
      where: { id: staffId },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        role: dto.role,
        color: dto.color,
      },
    });
  }

  async deleteStaff(ownerId: string, staffId: string) {
    await this.assertStaffBelongsToOwner(ownerId, staffId);
    // Prevent deletion if staff has future appointments
    const futureAppointments = await this.prisma.appointment.count({
      where: {
        staffId,
        start: { gte: new Date() },
        status: { not: 'CANCELLED' },
      },
    });
    if (futureAppointments > 0) {
      throw new ConflictException(
        'Cannot delete staff member with future appointments',
      );
    }
    await this.prisma.staff.delete({ where: { id: staffId } });
  }

  private async assertStaffBelongsToOwner(ownerId: string, staffId: string) {
    const business = await this.getBusinessByOwner(ownerId);
    const staff = await this.prisma.staff.findUnique({
      where: { id: staffId },
    });
    if (!staff || staff.businessId !== business.id) {
      throw new ForbiddenException(
        'Staff member not found in your business',
      );
    }
  }

  // ── Availability ──
  async getAvailability(ownerId: string) {
    const business = await this.getBusinessByOwner(ownerId);
    return this.prisma.availability.findMany({
      where: { businessId: business.id },
      orderBy: [{ weekday: 'asc' }, { start: 'asc' }],
    });
  }

  async setAvailability(ownerId: string, dto: SetAvailabilityDto) {
    const business = await this.getBusinessByOwner(ownerId);

    // Replace entire availability for the business in a transaction
    await this.prisma.$transaction(async (tx) => {
      // Delete existing
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

  // ── Appointments ──
  async getAppointments(ownerId: string, query: AppointmentsQueryDto) {
    const business = await this.getBusinessByOwner(ownerId);
    const where: any = { businessId: business.id };

    if (query.status) {
      where.status = query.status;
    }
    if (query.from || query.to) {
      where.start = {};
      if (query.from) where.start.gte = new Date(query.from);
      if (query.to) where.start.lte = new Date(query.to);
    }
    if (query.staffId) {
      where.staffId = query.staffId;
    }
    if (query.serviceId) {
      where.serviceId = query.serviceId;
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        service: true,
        staff: true,
      },
      orderBy: { start: query.orderByStart || 'asc' },
      skip: query.skip,
      take: query.take || 50,
    });
  }
}
