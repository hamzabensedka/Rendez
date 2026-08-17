import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments/webhook')
export class PaymentsWebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async handleWebhook(@Body() data: any) {
    try {
      await this.paymentsService.handleWebhook(data);
    } catch (error) {
      throw new BadRequestException('Invalid webhook data');
    }
  }
}