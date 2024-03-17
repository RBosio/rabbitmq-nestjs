import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class CommonService {
  constructor(private configService: ConfigService) {}

  getRMQOptions(queue: string): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [
          `amqp://${this.configService.get('RABBITMQ_DEFAULT_USER')}:${this.configService.get('RABBITMQ_DEFAULT_PASS')}@rabbitmq:5672`,
        ],
        queue,
        noAck: false,
        queueOptions: {
          durable: true,
        },
      },
    };
  }
}
