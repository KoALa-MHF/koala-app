import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, Profile, SamlOptions } from '@node-saml/passport-saml';
import { UsersService } from '../../users/users.service';
import { Config, SamlConfig } from '../../config/config';
import * as fs from 'fs';

export function createSamlConfig(config: SamlConfig): SamlOptions {
  return {
    issuer: config.issuer,
    callbackUrl: config.callbackUrl,
    cert: config.cert,
    privateKey: config.privateKeyPath ? fs.readFileSync(config.privateKeyPath, 'utf-8') : undefined,
    decryptionPvk: config.decryptionPvkPath ? fs.readFileSync(config.decryptionPvkPath, 'utf-8') : undefined,
    entryPoint: config.entryPoint,
    audience: config.audience,
    wantAuthnResponseSigned: config.wantAuthnResponseSigned,
    wantAssertionsSigned: config.wantAssertionsSigned,
    signatureAlgorithm: config.signatureAlgorithm,
    identifierFormat: config.identifierFormat,
    acceptedClockSkewMs: config.acceptedClockSkewMs,
    validateInResponseTo: config.validateInResponseTo,
    authnContext: config.authnContext
      ? [
          config.authnContext,
        ]
      : undefined,
    authnRequestBinding: config.authnRequestBinding,
    protocol: config.protocol,
  } as SamlOptions;
}

@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy, 'saml') {
  constructor(private readonly usersService: UsersService, private readonly config: Config) {
    super(createSamlConfig(config.saml));
  }

  async validate(profile: Profile) {
    try {
      return this.usersService.upsertBySamlProfile(profile, this.config.saml);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
