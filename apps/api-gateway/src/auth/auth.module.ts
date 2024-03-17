import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AUTH_SERVICE } from '../constants/services';
import { AuthController } from './auth.controller';

@Module({
  imports: [RmqModule.register({ name: AUTH_SERVICE })],
  controllers: [AuthController],
})
export class AuthModule {}
