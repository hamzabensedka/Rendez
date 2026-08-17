import { ApiProperty } from '@nestjs/swagger';

export class ServicesDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;
}