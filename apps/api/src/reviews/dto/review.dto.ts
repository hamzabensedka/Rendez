import { ApiProperty } from '@nestjs/swagger';

export class ReviewDto {
  @ApiProperty()
  rating: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  businessId: number;

  @ApiProperty()
  userId: number;
}
