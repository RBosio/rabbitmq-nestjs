import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { USER_SERVICE } from '../constants/services';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RmqModule.register({ name: USER_SERVICE }), AuthModule],
  controllers: [UsersController],
})
export class UsersModule {}
