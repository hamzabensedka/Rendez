import { ApiProperty } from '@nestjs/swagger';

export class ServicesDto {
  @ApiProperty({ example: 'Service 1' })
  name: string;

  @ApiProperty({ example: 'This is a service' })
  description: string;

  @ApiProperty({ example: 10.99 })
  price: number;
}
