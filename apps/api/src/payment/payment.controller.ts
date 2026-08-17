import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook')
  async webhook(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.handleWebhook(createPaymentDto);
  }
}
