import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsService } from './sessions.service';
import { SessionsResolver } from './sessions.resolver';
import { Session } from './entities/session.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Session])],
    providers: [SessionsResolver, SessionsService]
})
export class SessionsModule {}
