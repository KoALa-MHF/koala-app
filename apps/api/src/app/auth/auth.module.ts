import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SessionsModule } from '../sessions/sessions.module';
import { UserSessionsModule } from '../user-sessions/user-sessions.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'jWTSecret',
      signOptions: { expiresIn: '24h' },
    }),
    UserSessionsModule,
    SessionsModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
  ],
  exports: [],
})
export class AuthModule {}
