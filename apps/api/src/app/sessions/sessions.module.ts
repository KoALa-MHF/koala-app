import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsService } from './sessions.service';
import { SessionsResolver } from './sessions.resolver';
import { Session } from './entities/session.entity';
import { MediaModule } from '../media/media.module';
import { ToolbarsModule } from '../toolbars/toolbars.module';
import { UserSessionsModule } from '../user-sessions/user-sessions.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Session,
    ]),
    MediaModule,
    UsersModule,
    forwardRef(() => ToolbarsModule),
    forwardRef(() => UserSessionsModule),
  ],
  providers: [
    SessionsResolver,
    SessionsService,
  ],
  exports: [
    SessionsService,
  ],
})
export class SessionsModule {}
