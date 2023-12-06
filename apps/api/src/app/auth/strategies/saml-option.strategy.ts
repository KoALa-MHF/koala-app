import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, Profile, SamlOptions } from '@node-saml/passport-saml';
import { UsersService } from '../../users/users.service';
import { Config } from '../../config/config';
import * as fs from 'fs';

@Injectable()
export class SamlOptionStrategy extends PassportStrategy(Strategy, 'samlOption') {
  constructor(private readonly usersService: UsersService, private readonly config: Config) {
    super({
      issuer: config.saml.issuer,
      callbackUrl: config.saml.callbackUrl,
      cert: config.saml.cert,
      privateKey: config.saml.privateKeyPath ? fs.readFileSync(config.saml.privateKeyPath, 'utf-8') : undefined,
      decryptionPvk: config.saml.decryptionPvkPath
        ? fs.readFileSync(config.saml.decryptionPvkPath, 'utf-8')
        : undefined,
      entryPoint: config.saml.entryPoint,
      audience: config.saml.audience,
      wantAuthnResponseSigned: config.saml.wantAuthnResponseSigned,
      signatureAlgorithm: config.saml.signatureAlgorithm,
      identifierFormat: config.saml.identifierFormat,
      acceptedClockSkewMs: config.saml.acceptedClockSkewMs,
      validateInResponseTo: config.saml.validateInResponseTo,
      authnContext: config.saml.authnContext
        ? [
            config.saml.authnContext,
          ]
        : undefined,
      authnRequestBinding: config.saml.authnRequestBinding,
      protocol: config.saml.protocol,
    } as SamlOptions);

    console.log(
      this.generateServiceProviderMetadata(
        config.saml.decryptionCertPath ? fs.readFileSync(config.saml.decryptionCertPath, 'utf-8') : undefined
      )
    );
  }

  async validate(profile: Profile) {
    try {
      return this.usersService.upsertBySamlProfile(profile);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
