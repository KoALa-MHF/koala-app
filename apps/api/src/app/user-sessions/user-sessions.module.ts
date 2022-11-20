import { Module } from '@nestjs/common';
import { UserSessionsService } from './user-sessions.service';
import { UserSessionsResolver } from './user-sessions.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSession } from './entities/user-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserSession])],
  providers: [UserSessionsResolver, UserSessionsService],
})
export class UserSessionsModule {}
