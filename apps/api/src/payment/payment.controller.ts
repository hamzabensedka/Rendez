import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PaymentService } from './payment.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Create a Stripe Checkout Session for an appointment.
   */
  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  async createCheckoutSession(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateCheckoutSessionDto,
  ) {
    return this.paymentService.createCheckoutSession(user.id, dto);
  }

  /**
   * Get payment details for an appointment.
   */
  @Get('appointment/:appointmentId')
  async getPaymentByAppointment(
    @CurrentUser() user: { id: string },
    @Param('appointmentId') appointmentId: string,
  ) {
    return this.paymentService.getPaymentByAppointment(
      appointmentId,
      user.id,
    );
  }

  /**
   * Success redirect endpoint (handled by frontend).
   */
  @Get('success')
  async paymentSuccess(@Query('session_id') sessionId: string) {
    return {
      message: 'Payment completed successfully',
      sessionId,
    };
  }

  /**
   * Cancel redirect endpoint (handled by frontend).
   */
  @Get('cancel')
  async paymentCancel(@Query('payment_id') paymentId: string) {
    return {
      message: 'Payment was cancelled',
      paymentId,
    };
  }
}
