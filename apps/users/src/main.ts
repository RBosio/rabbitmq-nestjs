import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { CommonService } from '@app/common';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);

  const commonService = app.get(CommonService);

  app.connectMicroservice<MicroserviceOptions>(
    commonService.getRMQOptions('USER_QUEUE'),
  );

  app.startAllMicroservices();
}
bootstrap();
