import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

export class ModerateReviewDto {
  @ApiProperty({ enum: ['approve', 'reject'] })
  @IsIn(['approve', 'reject'])
  decision!: 'approve' | 'reject';
}
