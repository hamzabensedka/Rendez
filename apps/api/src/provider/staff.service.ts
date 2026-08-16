import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StaffService {
  constructor(private readonly prisma: PrismaService) {}

  async getStaff() {
    return this.prisma.staff.findMany();
  }

  async getStaffMember(id: number) {
    return this.prisma.staff.findUnique({ where: { id } });
  }

  async createStaffMember(staff: any) {
    return this.prisma.staff.create({ data: staff });
  }
}
