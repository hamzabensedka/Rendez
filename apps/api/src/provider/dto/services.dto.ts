import { ApiProperty } from '@nestjs/swagger';

export class ServicesDto {
  @ApiProperty()
  serviceName: string;

  @ApiProperty()
  serviceDescription: string;

  @ApiProperty()
  servicePrice: number;
}