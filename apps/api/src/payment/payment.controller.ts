import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentService } from './payment.service';
import {
  CreatePaymentIntentDto,
  CreateCheckoutSessionDto,
} from './dto';
import { AuthenticatedRequest } from '../auth/types/authenticated-request.type';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('intent')
  async createPaymentIntent(
    @Body() dto: CreatePaymentIntentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const paymentIntent = await this.paymentService.createPaymentIntent(
      dto,
      req.user.id,
    );
    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async createCheckoutSession(
    @Body() dto: CreateCheckoutSessionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const session = await this.paymentService.createCheckoutSession(
      dto,
      req.user.id,
    );
    return {
      sessionId: session.id,
      url: session.url,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('appointment/:appointmentId')
  async getPaymentStatus(
    @Param('appointmentId') appointmentId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.paymentService.getPaymentByAppointment(appointmentId);
  }
}
