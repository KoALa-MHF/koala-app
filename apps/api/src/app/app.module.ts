import { Module } from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SessionsModule } from './sessions/sessions.module';
import { MediaModule } from './media/media.module';
import { MarkersModule } from './markers/markers.module';
import { UserSessionsModule } from './user-sessions/user-sessions.module';
import { AnnotationsModule } from './annotations/annotations.module';
import { formatError } from './core/formatters/grapqhl-error.formatter';
import { ConfigModule, mailConfig } from './config/config.module';
import { ToolbarsModule } from './toolbars/toolbars.module';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    DatabaseModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [
        JwtModule,
        UsersModule,
      ],
      driver: ApolloDriver,
      useFactory: async (jwtService: JwtService, userService: UsersService) => ({
        playground: true, // TODO: Dislable when production
        autoSchemaFile: true,
        installSubscriptionHandlers: true,
        formatError: formatError,
        introspection: true,
        context: ({ req }) => {
          return { req };
        },
        subscriptions: {
          'subscriptions-transport-ws': {
            onConnect: async (connectionParams) => {
              if (!connectionParams.headers) {
                return false;
              }

              const authToken = connectionParams.headers.Authorization;
              if (!authToken) {
                return false;
              }

              const token = authToken.split(' ')[1];
              const { sub } = jwtService.verify(token, { secret: 'jWTSecret' });

              const user = await userService.findOne(sub);
              return { user };
            },
          },
        },
      }),
      inject: [
        JwtService,
        UsersService,
      ],
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
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: __dirname + '/assets/images',
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
