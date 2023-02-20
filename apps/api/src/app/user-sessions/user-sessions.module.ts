import { forwardRef, Module } from '@nestjs/common';
import { UserSessionsService } from './user-sessions.service';
import { UserSessionsResolver } from './user-sessions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from './entities/user-session.entity';
import { SessionsModule } from '../sessions/sessions.module';
import { AnnotationsModule } from '../annotations/annotations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserSession,
    ]),
    SessionsModule,
    forwardRef(() => AnnotationsModule),
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
