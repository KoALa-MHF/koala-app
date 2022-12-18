/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { GraphQLValidationPipe } from './app/core/graphql/graphql-validation.pipe';
import { graphqlUploadExpress } from 'graphql-upload-minimal';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new GraphQLValidationPipe());
  app.use(graphqlUploadExpress({ maxFileSize: 1000000, maxFiles: 10 }));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
