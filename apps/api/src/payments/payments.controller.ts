import { Controller, Post, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    const payment = await this.paymentService.createPayment(createPaymentDto);
    return payment;
  }

  @Post(':id/success')
  async updateAppointmentStatus(@Param('id') id: number) {
    await this.paymentService.updateAppointmentStatus(id);
    return { message: 'Appointment status updated successfully' };
  }
}