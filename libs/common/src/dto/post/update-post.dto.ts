import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    name: 'title',
    type: 'string',
    example: 'Title updated',
    required: false,
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    name: 'description',
    type: 'string',
    example: 'Description updated',
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;
}
