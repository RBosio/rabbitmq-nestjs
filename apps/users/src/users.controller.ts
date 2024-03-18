import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService, UpdateUserDto } from '@app/common';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: 'findUsers' })
  findUsers(@Ctx() context: RmqContext, @Payload() data: any) {
    this.rmqService.acknowledgmentMessage(context);
    return this.usersService.findUsers();
  }

  @MessagePattern({ cmd: 'findUser' })
  findUser(@Ctx() context: RmqContext, @Payload() id: number) {
    this.rmqService.acknowledgmentMessage(context);
    return this.usersService.findUser(id);
  }

  @MessagePattern({ cmd: 'updateUser' })
  updateUser(
    @Ctx() context: RmqContext,
    @Payload() data: { userId: number; updateUserDto: UpdateUserDto },
  ) {
    this.rmqService.acknowledgmentMessage(context);
    return this.usersService.update(data.userId, data.updateUserDto);
  }

  @MessagePattern({ cmd: 'deleteUser' })
  deleteUser(@Ctx() context: RmqContext, @Payload() id: number) {
    this.rmqService.acknowledgmentMessage(context);

    return this.usersService.delete(id);
  }
}
