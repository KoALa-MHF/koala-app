import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, Profile } from '@node-saml/passport-saml';
import { UsersService } from '../../users/users.service';
import * as fs from 'fs';
import { Config } from '../../config/config';

@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService, private readonly config: Config) {
    super({
      issuer: config.samlConfig.issuer,
      callbackUrl: config.samlConfig.callbackUrl,
      cert: config.samlConfig.cert,
      entryPoint: config.samlConfig.entryPoint,
      audiance: config.samlConfig.audiance,
      wantAuthnResponseSigned: config.samlConfig.wantAuthnResponseSigned,
    });
  }

  async validate(profile: Profile) {
    try {
      console.log('PROFILE', profile);
      return this.usersService.upsertBySamlProfile(profile);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
