import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { FavoritesService } from './favorites.service';

@ApiTags('favorites')
@Controller('users/me/favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'List current user favorites' })
  async list(@CurrentUser() user: AuthenticatedUser) {
    return this.favoritesService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add business to favorites' })
  async add(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { businessId: string }
  ) {
    return this.favoritesService.add(user.id, body.businessId);
  }

  @Delete(':businessId')
  @ApiOperation({ summary: 'Remove business from favorites' })
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('businessId') businessId: string
  ) {
    await this.favoritesService.remove(user.id, businessId);
  }
}
