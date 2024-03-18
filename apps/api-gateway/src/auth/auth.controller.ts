import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AUTH_SERVICE } from '../constants/services';
import { ClientRMQ } from '@nestjs/microservices';
import { CreateUserDto } from '@app/common';
import { catchError, of } from 'rxjs';
import { LoginUserDto } from '@app/common';

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
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authClient.send({ cmd: 'loginUser' }, loginUserDto).pipe(
      catchError((val) => {
        if (val.status === 401) {
          throw new UnauthorizedException(val.message);
        }

        return of(val);
      }),
    );
  }
}
