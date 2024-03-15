import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ skipMissingProperties: true }));
  app.enableCors({
    origin: ['http://localhost:4200', 'http://localhost:4201'],
  });
  await app.listen(process.env.APP_PORT);
}
bootstrap();
