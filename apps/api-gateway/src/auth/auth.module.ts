import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AUTH_SERVICE } from '../constants/services';

@Module({
  imports: [RmqModule.register({ name: AUTH_SERVICE })],
  controllers: [],
})
export class AuthModule {}
