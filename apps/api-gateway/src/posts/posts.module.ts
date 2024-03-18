import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { POST_SERVICE } from '../constants/services';

@Module({
  imports: [RmqModule.register({ name: POST_SERVICE })],
  controllers: [],
})
export class PostsModule {}
