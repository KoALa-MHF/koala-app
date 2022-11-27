import { Module } from '@nestjs/common';

import { GraphQLModule } from '@nestjs/graphql';
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
import { formatError } from './core/graphql/grapqhl-error';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'koala',
      entities: [Session, Media, Marker, Annotation, UserSession],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: true,
      formatError: formatError,
      introspection:true,
    }),
    SessionsModule,
    MediaModule,
    MarkersModule,
    UserSessionsModule,
    AnnotationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
