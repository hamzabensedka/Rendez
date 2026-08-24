import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/** Fields safe to return to any authorized caller. Never includes passwordHash. */
export const USER_PUBLIC_SELECT = {
  id: true,
  email: true,
  name: true,
  phone: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...data } = createUserDto;
    const passwordHash = await argon2.hash(password);
    return this.prisma.user.create({
      data: { ...data, passwordHash },
      select: USER_PUBLIC_SELECT,
    });
  }

  findAll(page = 1, limit = DEFAULT_PAGE_SIZE) {
    const take = Math.min(Math.max(Math.trunc(limit) || DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);
    const skip = Math.max(Math.trunc(page) - 1, 0) * take;
    return this.prisma.$transaction([
      this.prisma.user.findMany({
        select: USER_PUBLIC_SELECT,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      }),
      this.prisma.user.count(),
    ]);
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        ...USER_PUBLIC_SELECT,
        providerProfile: {
          select: { id: true, businessId: true, isOwner: true, displayName: true },
        },
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...data } = updateUserDto;
    const passwordHash = password ? await argon2.hash(password) : undefined;
    return this.prisma.user.update({
      where: { id },
      data: passwordHash ? { ...data, passwordHash } : data,
      select: USER_PUBLIC_SELECT,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select: USER_PUBLIC_SELECT,
    });
  }
}
