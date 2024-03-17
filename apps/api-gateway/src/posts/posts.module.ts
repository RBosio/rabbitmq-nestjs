import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { POST_SERVICE } from '../constants/services';
import { PostsController } from './posts.controller';

@Module({
  imports: [RmqModule.register({ name: POST_SERVICE })],
  controllers: [PostsController],
})
export class PostsModule {}
