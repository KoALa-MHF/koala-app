import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupApplication, setupMailDevelopmentServer } from './bootstrap';

async function bootstrap() {
  if (process.env['NODE' + '_ENV'] === 'development') {
    setupMailDevelopmentServer();
  }

  const app = await NestFactory.create(AppModule);
  setupApplication(app);
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
