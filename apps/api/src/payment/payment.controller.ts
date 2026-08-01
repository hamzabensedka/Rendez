import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';
import { PaymentService } from './payment.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  @HttpCode(HttpStatus.OK)
  async createCheckoutSession(
    @Body() dto: CreateCheckoutSessionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.paymentService.createCheckoutSession(dto, user.id);
  }

  @Post('payment-intent')
  @HttpCode(HttpStatus.OK)
  async createPaymentIntent(
    @Body() dto: CreateCheckoutSessionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.paymentService.createPaymentIntent(dto, user.id);
  }

  @Get('status/:appointmentId')
  async getPaymentStatus(
    @Param('appointmentId') appointmentId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.paymentService.getPaymentStatus(appointmentId, user.id);
  }
}
