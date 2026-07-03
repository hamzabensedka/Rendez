import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { SavePaymentMethodDto } from './dto/save-payment-method.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create-payment-intent')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a Stripe PaymentIntent for booking payment' })
  @ApiResponse({ status: 200, description: 'PaymentIntent created successfully.' })
  async createPaymentIntent(@Body() dto: CreatePaymentIntentDto) {
    return this.paymentService.createPaymentIntent(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm payment and finalize appointment booking' })
  @ApiResponse({ status: 200, description: 'Payment confirmed and appointment created.' })
  async confirmPayment(@Body() dto: ConfirmPaymentDto) {
    return this.paymentService.confirmPayment(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refund')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refund a payment (admin/provider use)' })
  @ApiResponse({ status: 200, description: 'Payment refunded successfully.' })
  async refundPayment(@Body() dto: RefundPaymentDto) {
    return this.paymentService.refundPayment(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('save-method')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save a payment method for future use' })
  @ApiResponse({ status: 200, description: 'Payment method saved.' })
  async savePaymentMethod(@Body() dto: SavePaymentMethodDto) {
    return this.paymentService.savePaymentMethod(dto);
  }
}
