import { IsUUID, IsUrl, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsUUID()
  appointmentId: string;

  @IsUrl()
  successUrl: string;

  @IsUrl()
  cancelUrl: string;

  @IsOptional()
  @IsString()
  @IsIn(['eur', 'us', 'gbp'])
  currency?: string = 'eur';
}
