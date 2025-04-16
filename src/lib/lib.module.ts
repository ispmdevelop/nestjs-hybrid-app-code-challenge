import { Module, Global } from '@nestjs/common';
import { MessageProducerService } from './message-producer/message-producer.service';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MQTT_CLIENT',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [(configService.get<string>('RABBIT_MQ_BROKER_URL') || '')],
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [MessageProducerService],
  exports: [MessageProducerService],
})
export class LibModule { }
