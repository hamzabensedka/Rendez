import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { CreateServiceVariantDto } from './dto/create-service-variant.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findByBusiness(businessId: string) {
    return this.prisma.service.findMany({
      where: {
        businessId,
        isActive: true,
      },
      include: {
        serviceVariants: true,
      },
    });
  }

  async create(businessId: string, userId: string, dto: CreateServiceDto) {
    // Verify user owns the business
    await this.verifyBusinessOwner(businessId, userId);

    return this.prisma.service.create({
      data: {
        businessId,
        name: dto.name,
        description: dto.description,
        category: dto.category,
        baseDurationMin: dto.baseDurationMin,
        isActive: true,
      },
    });
  }

  async createVariant(
    businessId: string,
    userId: string,
    serviceId: string,
    dto: CreateServiceVariantDto
  ) {
    // Verify service belongs to business and user owns it
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || service.businessId !== businessId) {
      throw new NotFoundException('Service not found');
    }

    await this.verifyBusinessOwner(businessId, userId);

    return this.prisma.serviceVariant.create({
      data: {
        serviceId,
        name: dto.name,
        priceCents: dto.priceCents,
        durationMin: dto.durationMin,
        bufferBeforeMin: dto.bufferBeforeMin || 0,
        bufferAfterMin: dto.bufferAfterMin || 0,
        capacity: dto.capacity || 1,
      },
    });
  }

  private async verifyBusinessOwner(businessId: string, userId: string) {
    const provider = await this.prisma.provider.findFirst({
      where: {
        userId,
        businessId,
        isOwner: true,
      },
    });

    if (!provider) {
      throw new ForbiddenException('You do not own this business');
    }
  }
}

