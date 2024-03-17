import { NestFactory } from '@nestjs/core';
import { PostsModule } from './posts.module';
import { CommonService } from '@app/common';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(PostsModule);

  const commonService = app.get(CommonService);

  app.connectMicroservice<MicroserviceOptions>(
    commonService.getRMQOptions('POST_QUEUE'),
  );

  app.startAllMicroservices();
}
bootstrap();
