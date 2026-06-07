import { Controller, Post, Body, Get, Param, Req, Headers } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { SavePaymentMethodDto } from './dto/save-payment-method.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent')
  async createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto) {
    return this.paymentService.createPaymentIntent(
      createPaymentIntentDto.amount,
      createPaymentIntentDto.currency,
      createPaymentIntentDto.businessId,
      createPaymentIntentDto.customerId,
    );
  }

  @Post('confirm')
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    return this.paymentService.confirmPayment(confirmPaymentDto.paymentIntentId);
  }

  @Post('refund')
  async refundPayment(@Body() refundPaymentDto: RefundPaymentDto) {
    return this.paymentService.processRefund(refundPaymentDto.paymentIntentId, refundPaymentDto.amount);
  }

  @Post('save-method')
  async savePaymentMethod(@Body() savePaymentMethodDto: SavePaymentMethodDto) {
    return this.paymentService.savePaymentMethod(savePaymentMethodDto.customerId, savePaymentMethodDto.paymentMethodId);
  }

  @Get('methods/:customerId')
  async getPaymentMethods(@Param('customerId') customerId: string) {
    return this.paymentService.getPaymentMethods(customerId);
  }

  @Post('webhook')
  async handleWebhook(@Req() req: any, @Headers('stripe-signature') signature: string) {
    return this.paymentService.handleWebhook(req.rawBody, signature);
  }
}