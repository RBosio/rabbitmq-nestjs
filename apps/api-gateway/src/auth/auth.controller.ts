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

@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientRMQ) {}

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
    const res = await lastValueFrom(
      this.authClient.send({ cmd: 'loginUser' }, loginUserDto).pipe(
        catchError((val) => {
          if (val.status === 401) {
            throw new UnauthorizedException(val.message);
          }

          return of(val);
        }),
      ),
    );

    response.cookie('token', res.token);
    response.status(HttpStatus.OK).json(res);
  }
}
