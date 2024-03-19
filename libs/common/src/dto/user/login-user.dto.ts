import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    name: 'email',
    type: 'string',
    example: 'bwayne@gmail.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    type: 'string',
    example: '123',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
