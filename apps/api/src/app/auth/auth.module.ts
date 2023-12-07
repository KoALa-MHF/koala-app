import { Module, ModuleMetadata } from '@nestjs/common';
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
import { config, authConfig } from '../config/config.module';
import { SamlOptionStrategy } from './strategies/saml-option.strategy';

const moduleConfig = {
  imports: [
    PassportModule,
    JwtModule.register({
      secret: authConfig.secret,
      signOptions: { expiresIn: authConfig.expiresIn },
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
} as ModuleMetadata;

if (config.samlOption) {
  moduleConfig.providers.push(SamlOptionStrategy);
}

@Module(moduleConfig)
export class AuthModule {}
