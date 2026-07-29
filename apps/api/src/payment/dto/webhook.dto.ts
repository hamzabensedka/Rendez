import { ApiProperty } from '@nestjs/swagger';

export class WebhookDto {
  @ApiProperty()
  raw: string;

  @ApiProperty()
  signature: string;
}