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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'koala',
      entities: [Session, Media],
      synchronize: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: false,
      playground: true,
      autoSchemaFile: true,
    }),
    SessionsModule,
    MediaModule,
    MarkersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
