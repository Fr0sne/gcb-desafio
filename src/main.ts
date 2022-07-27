import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
  MicroserviceOptions,
} from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
