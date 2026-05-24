import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthenticatedUser } from './types/authenticated-user.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke refresh token (this device)' })
  @ApiResponse({ status: 204, description: 'Session revoked or token invalid' })
  async logout(@Body() dto: LogoutDto) {
    if (dto.refreshToken) {
      await this.authService.logoutWithRefreshToken(dto.refreshToken);
    }
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke all refresh sessions for current user' })
  @ApiResponse({ status: 204, description: 'All refresh sessions revoked' })
  async logoutAll(@CurrentUser() user: AuthenticatedUser) {
    await this.authService.logoutAllForUser(user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Canonical profile endpoint. Use this instead of a separate /users/me profile route.',
  })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.findOne(user.id);
  }
}

