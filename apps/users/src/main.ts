import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<MicroserviceOptions>(
    rmqService.getRMQOptions('USER'),
  );

  app.startAllMicroservices();
}
bootstrap();
