import { IsString } from 'class-validator';

export class SavePaymentMethodDto {
  @IsString()
  customerId: string;

  @IsString()
  paymentMethodId: string;
}