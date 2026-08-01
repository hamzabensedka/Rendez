import { IsUUID } from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsUUID('4')
  appointmentId: string;
}
