import { INestApplication } from '@nestjs/common';
import { GraphQLValidationPipe } from './app/core/pipes/graphql-validation.pipe';
import { graphqlUploadExpress } from 'graphql-upload';
import * as MailDev from 'maildev';
import helmet from 'helmet';

export const GLOBAL_PREFIX = 'api';

interface IMailDev {
  getAllEmail(done: (error: Error, emails: Array<object>) => void): void;
  on(eventName: string, callback: (email: object) => void): void;
}

export function setupApplication(app: INestApplication) {
  app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }));
  app.useGlobalPipes(new GraphQLValidationPipe());
  app.use(graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }));
  app.setGlobalPrefix(GLOBAL_PREFIX);
}

export function setupMailDevelopmentServer(): Promise<IMailDev> {
  return new Promise((resolve, reject) => {
    const maildev = new MailDev({});
    maildev.listen((error) => {
      if (error) {
        reject(error);
      } else {
        resolve(maildev);
      }
    });
  });
}
