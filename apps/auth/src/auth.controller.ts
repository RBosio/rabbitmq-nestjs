import { Controller, Get, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ClientRMQ,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CreateUserDto, LoginUserDto, RmqService, User } from '@app/common';
import { USER_SERVICE } from 'apps/api-gateway/src/constants/services';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private rmqService: RmqService,
    @Inject(USER_SERVICE) private userClient: ClientRMQ,
  ) {}

  @MessagePattern({ cmd: 'createUser' })
  async register(
    @Ctx() context: RmqContext,
    @Payload() createUserDto: CreateUserDto,
  ): Promise<User> {
    this.rmqService.acknowledgmentMessage(context);

    const userFounded = await lastValueFrom(
      this.userClient.send({ cmd: 'findUserByEmail' }, createUserDto.email),
    );

    return this.authService.register(createUserDto, userFounded);
  }

  @MessagePattern({ cmd: 'loginUser' })
  async login(
    @Ctx() context: RmqContext,
    @Payload() loginUserDto: LoginUserDto,
  ): Promise<User> {
    this.rmqService.acknowledgmentMessage(context);

    const userFounded = await lastValueFrom(
      this.userClient.send({ cmd: 'findUserByEmail' }, loginUserDto.email),
    );

    return this.authService.login(loginUserDto, userFounded);
  }
}
