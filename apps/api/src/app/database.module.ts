import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Annotation } from './annotations/entities/annotation.entity';
import { databaseConfig } from './config/config.module';
import { Marker } from './markers/entities/marker.entity';
import { Media } from './media/entities/media.entity';
import { Session } from './sessions/entities/session.entity';
import { Toolbar } from './toolbars/entities/toolbar.entity';
import { UserSession } from './user-sessions/entities/user-session.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: databaseConfig.name,
      entities: [
        Session,
        Media,
        Marker,
        Annotation,
        UserSession,
        User,
        Toolbar,
      ],
      synchronize: databaseConfig.synchronize,
      dropSchema: databaseConfig.dropSchema,
    } as TypeOrmModuleOptions),
  ],
})
export class DatabaseModule {}
