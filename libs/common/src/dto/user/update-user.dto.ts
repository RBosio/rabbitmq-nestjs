import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    name: 'name',
    type: 'string',
    example: 'Joker',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    name: 'password',
    type: 'string',
    example: '456',
    required: false,
  })
  @IsOptional()
  @IsString()
  password: string;
}
