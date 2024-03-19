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
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientRMQ,
    @Inject(USER_SERVICE) private userClient: ClientRMQ,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'register' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'user created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'email already exists',
  })
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
  @ApiOperation({ summary: 'login' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'user logged',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'email or password wrong',
  })
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

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Post('logout')
  @ApiOperation({ summary: 'logout' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'logout',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unauthorized',
  })
  async logout(@Res() response: Response) {
    response.clearCookie('token');
    response.status(HttpStatus.OK).json('logout');
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'show profile' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'get profile',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'unauthorized',
  })
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
