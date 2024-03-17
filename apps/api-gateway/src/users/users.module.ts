import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { USER_SERVICE } from '../constants/services';
import { UsersController } from './users.controller';

@Module({
  imports: [RmqModule.register({ name: USER_SERVICE })],
  controllers: [UsersController],
})
export class UsersModule {}
