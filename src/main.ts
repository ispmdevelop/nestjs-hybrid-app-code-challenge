import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [(configService.get<string>('RABBIT_MQ_BROKER_URL') || '')],
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });

  // SWAGGER Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tasks API')
    .setDescription('Tasks API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory(), {
    jsonDocumentUrl: 'docs/json',
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
