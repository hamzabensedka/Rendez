import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUser(id: number) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
  }
}