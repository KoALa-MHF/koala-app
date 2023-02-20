import { Module } from '@nestjs/common';
import { UserSessionsService } from './user-sessions.service';
import { UserSessionsResolver } from './user-sessions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from './entities/user-session.entity';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserSession,
    ]),
    SessionsModule,
  ],
  providers: [
    UserSessionsResolver,
    UserSessionsService,
  ],
  exports: [
    UserSessionsService,
  ],
})
export class UserSessionsModule {}
