import { INestApplication } from '@nestjs/common';
import { GraphQLValidationPipe } from './app/core/pipes/graphql-validation.pipe';
import { graphqlUploadExpress } from 'graphql-upload';
import * as MailDev from 'maildev';

export function setupApplication(app: INestApplication) {
  app.useGlobalPipes(new GraphQLValidationPipe());
  app.use(graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }));
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
}

export function setupMailDevelopmentServer() {
  const maildev = new MailDev({});
  maildev.listen();
  return maildev;
}
