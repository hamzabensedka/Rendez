import { IsString } from 'class-validator';

export class SavePaymentMethodDto {
  @IsString()
  paymentMethodId: string;

  @IsString()
  clientId: string;
}
