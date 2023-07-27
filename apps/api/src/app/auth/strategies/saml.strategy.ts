import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, Profile, SamlOptions } from '@node-saml/passport-saml';
import { UsersService } from '../../users/users.service';
import { Config } from '../../config/config';
import * as fs from 'fs';

@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService, private readonly config: Config) {
    const privateKey = config.saml.privateKeyPath ? fs.readFileSync(config.saml.privateKeyPath, 'utf-8') : undefined;
    console.log('privateKey', privateKey);

    super({
      issuer: config.saml.issuer,
      callbackUrl: config.saml.callbackUrl,
      cert: config.saml.cert,
      privateKey: privateKey,
      decryptionPvk: privateKey,
      entryPoint: config.saml.entryPoint,
      audience: config.saml.audience,
      wantAuthnResponseSigned: config.saml.wantAuthnResponseSigned,
      identifierFormat: config.saml.identifierFormat,
    } as SamlOptions);
  }

  async validate(profile: Profile) {
    try {
      console.log(profile);
      return this.usersService.upsertBySamlProfile(profile);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
