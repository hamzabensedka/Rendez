import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty()
  rating?: number;

  @ApiProperty()
  comment?: string;
}