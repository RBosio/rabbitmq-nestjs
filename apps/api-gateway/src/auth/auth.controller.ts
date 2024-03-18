import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_SERVICE } from '../constants/services';
import { ClientRMQ } from '@nestjs/microservices';
import { CreateUserDto } from '@app/common';
import { catchError, lastValueFrom, of } from 'rxjs';
import { LoginUserDto } from '@app/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientRMQ,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authClient.send({ cmd: 'createUser' }, createUserDto).pipe(
      catchError((val) => {
        if (val.status === 400) {
          throw new BadRequestException(val.message);
        }

        return of(val);
      }),
    );
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() response: Response) {
    const user = await lastValueFrom(
      this.authClient.send({ cmd: 'loginUser' }, loginUserDto).pipe(
        catchError((val) => {
          if (val.status === 401) {
            throw new UnauthorizedException(val.message);
          }

          return of(val);
        }),
      ),
    );

    const token = await this.jwtService.signAsync({ sub: user.id });

    response.cookie('token', token);
    response.status(HttpStatus.OK).json({ token });
  }

  @Post('logout')
  async logout(@Res() response: Response) {
    response.clearCookie('token');
    response.status(HttpStatus.OK).json('logout');
  }
}
