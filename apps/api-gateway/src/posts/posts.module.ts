import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { POST_SERVICE, USER_SERVICE } from '../constants/services';
import { PostsController } from './posts.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    RmqModule.register({ name: POST_SERVICE }),
    RmqModule.register({ name: USER_SERVICE }),
    AuthModule,
  ],
  controllers: [PostsController],
})
export class PostsModule {}
