import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice<MicroserviceOptions>(
    rmqService.getRMQOptions('AUTH'),
  );

  app.startAllMicroservices();
}
bootstrap();
