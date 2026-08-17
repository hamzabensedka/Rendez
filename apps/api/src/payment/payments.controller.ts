import { Controller, Post, Body, Get, Query, Patch, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../auth/decorators/auth.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../auth/types/authenticated-user.type';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Auth()
  async create(@Body() paymentDto: PaymentDto, @CurrentUser() user: User) {
    return this.paymentsService.create(paymentDto, user);
  }

  @Get()
  @Auth()
  async findAll(@Query() query: any) {
    return this.paymentsService.findAll(query);
  }

  @Get(':id')
  @Auth()
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  async update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }

  @Post(':id/fulfill')
  @Auth()
  async fulfillOrder(@Param('id') id: string) {
    return this.paymentsService.fulfillOrder(id);
  }
}