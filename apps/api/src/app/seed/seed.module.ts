import { SeedService } from './seed.service';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../sessions/entities/session.entity';
import { SessionsSeeder } from './seeders/sessions.seeder';
import { UsersSeeder } from './seeders/users.seeder';
import { User } from '../users/entities/user.entity';
import { UserSessionsSeeder } from './seeders/user-sessions.seeder';
import { UserSession } from '../user-sessions/entities/user-session.entity';
import { Annotation } from '../annotations/entities/annotation.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Marker } from '../markers/entities/marker.entity';
import { Toolbar } from '../toolbars/entities/toolbar.entity';
import { Media } from '../media/entities/media.entity';
import { MediaSeeder } from './seeders/media.seeder';
import { MarkersSeeder } from './seeders/markers.seeder';
import { AnnotationsSeeder } from './seeders/annotations.seeder';
import { CommentsSeeder } from './seeders/comments.seeder';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      User,
      Media,
      Session,
      UserSession,
      Annotation,
      Toolbar,
      Marker,
      Comment,
    ]),
  ],
  controllers: [],
  providers: [
    SeedService,
    MediaSeeder,
    UsersSeeder,
    SessionsSeeder,
    UserSessionsSeeder,
    MarkersSeeder,
    AnnotationsSeeder,
    CommentsSeeder,
  ],
})
export class SeedModule {}
