import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    name: 'title',
    type: 'string',
    example: 'A simple title',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    name: 'description',
    type: 'string',
    example: 'A simple description',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    name: 'userId',
    type: 'number',
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
