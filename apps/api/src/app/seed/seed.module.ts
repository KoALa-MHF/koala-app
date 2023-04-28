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
import { Marker } from '../markers/entities/marker.entity';
import { Toolbar } from '../toolbars/entities/toolbar.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      User,
      Session,
      UserSession,
      Annotation,
      Toolbar,
      Marker,
    ]),
  ],
  controllers: [],
  providers: [
    SeedService,
    UsersSeeder,
    SessionsSeeder,
    UserSessionsSeeder,
  ],
})
export class SeedModule {}
