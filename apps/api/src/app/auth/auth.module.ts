import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SessionsModule } from '../sessions/sessions.module';
import { UserSessionsModule } from '../user-sessions/user-sessions.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { SamlStrategy } from './strategies/saml.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'jWTSecret',
      signOptions: { expiresIn: '60s' },
    }),
    UserSessionsModule,
    UsersModule,
    SessionsModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    SamlStrategy,
  ],
  controllers: [
    AuthController,
  ],
  exports: [],
})
export class AuthModule {}
