import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { CommonService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const commonService = app.get(CommonService);

  app.connectMicroservice<MicroserviceOptions>(
    commonService.getRMQOptions('AUTH_QUEUE'),
  );

  app.startAllMicroservices();
}
bootstrap();
