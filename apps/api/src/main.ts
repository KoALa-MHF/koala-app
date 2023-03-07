/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { GraphQLValidationPipe } from './app/core/pipes/graphql-validation.pipe';
import { graphqlUploadExpress } from 'graphql-upload';

import * as MailDev from 'maildev';

function setupMailDevelopmentServer() {
  const maildev = new MailDev({});
  maildev.listen();
}

async function bootstrap() {
  if (process.env.NODE_ENV === 'development') {
    setupMailDevelopmentServer();
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new GraphQLValidationPipe());
  app.use(graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
