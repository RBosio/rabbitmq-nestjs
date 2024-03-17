import { NestFactory } from '@nestjs/core';
import { PostsModule } from './posts.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(PostsModule);

  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice<MicroserviceOptions>(
    rmqService.getRMQOptions('POST'),
  );

  app.startAllMicroservices();
}
bootstrap();
