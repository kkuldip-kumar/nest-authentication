import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  app.enableCors({ origin: "*" });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),

    new ValidationPipe({
      transform: true,
      transformOptions: { groups: ['transform'] },
    }),
  )
  await app.listen(port);
  Logger.log(`~ Application is running on: ${port}`);
}
bootstrap();
