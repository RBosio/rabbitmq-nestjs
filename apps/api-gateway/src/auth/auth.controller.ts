import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AUTH_SERVICE, USER_SERVICE } from '../constants/services';
import { ClientRMQ } from '@nestjs/microservices';
import { CreateUserDto } from '@app/common';
import { catchError, lastValueFrom, of } from 'rxjs';
import { LoginUserDto } from '@app/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientRMQ,
    @Inject(USER_SERVICE) private userClient: ClientRMQ,
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

  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@Req() request, @Res() response: Response) {
    const userId = request.user.id;
    const user = await lastValueFrom(
      this.userClient.send({ cmd: 'findUser' }, userId).pipe(
        catchError((val) => {
          if (val.status === 404) {
            throw new UnauthorizedException(val.message);
          }

          return of(val);
        }),
      ),
    );

    response.status(HttpStatus.OK).json({ user });
  }
}
