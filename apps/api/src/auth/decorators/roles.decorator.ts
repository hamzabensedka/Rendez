import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@planity/shared';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

