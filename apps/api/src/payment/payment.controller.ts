import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/types/authenticated-user.type';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  async createCheckout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCheckoutSessionDto,
  ) {
    return this.paymentService.createCheckoutSession(user.id, dto);
  }

  @Get('status/:appointmentId')
  @UseGuards(JwtAuthGuard)
  async getStatus(@Param('appointmentId') appointmentId: string) {
    return this.paymentService.getPaymentStatus(appointmentId);
  }
}
