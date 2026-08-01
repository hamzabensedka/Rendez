import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsUUID()
  appointmentId: string;

  @IsOptional()
  @IsString()
  successUrl?: string;

  @IsOptional()
  @IsString()
  cancelUrl?: string;

  @IsOptional()
  @IsString()
  currency?: string;
}
