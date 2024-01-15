import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, Profile } from '@node-saml/passport-saml';
import { UsersService } from '../../users/users.service';
import { Config } from '../../config/config';
import { createSamlConfig } from './saml.strategy';

@Injectable()
export class SamlOptionStrategy extends PassportStrategy(Strategy, 'samlOption') {
  constructor(private readonly usersService: UsersService, private readonly config: Config) {
    super(createSamlConfig(config.samlOption));
  }

  async validate(profile: Profile) {
    try {
      return this.usersService.upsertBySamlProfile(profile, this.config.samlOption);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
