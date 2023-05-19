import { Module } from '@nestjs/common';

import { GraphQLModule, SubscriptionConfig } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionsModule } from './sessions/sessions.module';
import { Session } from './sessions/entities/session.entity';
import { MediaModule } from './media/media.module';
import { Media } from './media/entities/media.entity';
import { MarkersModule } from './markers/markers.module';
import { Marker } from './markers/entities/marker.entity';
import { UserSessionsModule } from './user-sessions/user-sessions.module';
import { UserSession } from './user-sessions/entities/user-session.entity';
import { AnnotationsModule } from './annotations/annotations.module';
import { Annotation } from './annotations/entities/annotation.entity';
import { formatError } from './core/formatters/grapqhl-error.formatter';
import { ConfigModule, databaseConfig, mailConfig } from './config/config.module';
import { ToolbarsModule } from './toolbars/toolbars.module';
import { Toolbar } from './toolbars/entities/toolbar.entity';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true, // TODO: Dislable when production
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      formatError: formatError,
      introspection: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: (connectionParams) => {
            console.log(connectionParams);
          },
        },
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: mailConfig.host,
        port: mailConfig.port,
        auth: {
          user: mailConfig.user, // generated ethereal user
          pass: mailConfig.password, // generated ethereal password
        },
        // ignoreTLS: true,
        // secure: false,
      },
      defaults: {
        from: mailConfig.from,
      },
      template: {
        dir: __dirname + '/assets/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    SessionsModule,
    ToolbarsModule,
    MediaModule,
    MarkersModule,
    UserSessionsModule,
    UsersModule,
    AnnotationsModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
