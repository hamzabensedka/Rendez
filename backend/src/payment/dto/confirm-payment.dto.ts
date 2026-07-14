import { IsString, IsOptional } from 'class-validator';

export class ConfirmPaymentDto {
  @IsString()
  paymentId: string;

  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @IsOptional()
  @IsString()
  returnUrl?: string;
}
