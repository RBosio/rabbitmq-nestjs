import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, Post, PostRepository, RmqModule } from '@app/common';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_SERVICE } from 'apps/api-gateway/src/constants/services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_POST_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule.register({ name: USER_SERVICE }),
    DatabaseModule,
    TypeOrmModule.forFeature([Post]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostRepository],
})
export class PostsModule {}
