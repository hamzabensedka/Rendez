import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import { PaymentService } from './payments.service';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook')
  @Headers('x-stripe-signature')
  async webhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    const event = await this.paymentService.handleWebhook(req.body, sig);
    return res.json(event);
  }
}