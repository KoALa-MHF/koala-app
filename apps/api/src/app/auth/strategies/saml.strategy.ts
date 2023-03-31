import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Strategy, Profile } from '@node-saml/passport-saml';

@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      issuer: 'tastysoft.de',
      callbackUrl: 'http://localhost:3333/api/auth/sso/saml/ac',
      cert: 'MIIDmDCCAoACCQDiInlij1vKLDANBgkqhkiG9w0BAQsFADCBjDELMAkGA1UEBhMCZGUxEDAOBgNVBAgMB0dlcm1hbnkxETAPBgNVBAcMCFdpZXNsb2NoMRIwEAYDVQQKDAlUYXN0eVNvZnQxCzAJBgNVBAsMAklUMRUwEwYDVQQDDAx0YXN0eXNvZnQuZGUxIDAeBgkqhkiG9w0BCQEWEWluZm9AdGFzdHlzb2Z0LmRlMCAXDTIzMDMzMDEzNTA1N1oYDzMwMjIwNzMxMTM1MDU3WjCBjDELMAkGA1UEBhMCZGUxEDAOBgNVBAgMB0dlcm1hbnkxETAPBgNVBAcMCFdpZXNsb2NoMRIwEAYDVQQKDAlUYXN0eVNvZnQxCzAJBgNVBAsMAklUMRUwEwYDVQQDDAx0YXN0eXNvZnQuZGUxIDAeBgkqhkiG9w0BCQEWEWluZm9AdGFzdHlzb2Z0LmRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4lXUKINoUqbSuRb7t6QM7QBCscO+vx8/LH3BsRG1hqCs2ZlkJ2dDpX+dYIDAT555+/sMn7KWaWgQKFgK4cDgK6lhlyf7Ue1yobhXPg7nXampBk3i5uWjFMCcv2ZQvfJUL0F4zsAfsuWyICuQs1v6y3oNC6wrRTZK8Rti9dohpEXWimZttEQhp185+0p+Kdm91ee1fBXSkbpRswLh04E/iri/IuQ+bzrobFRkTrOhHHK8O4uzboHjOu807akZ6EWq8I3A42fQWr889iu+TbLpOhYQFXTtIN8205WiH3E8enj4RidPtyitYDs2O/y0515jQbqPkIThlQBtrcGJ6kp/HQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQDhttYBZFfq9C/WStZTTiItNeGsHcdtfRehEIpgcGvdNDBPT1IQtx5dbX92YZdxqAofU37QANPe6UBZ4LlQ0MqySWHrDgSqlBS464+xNDoulaK3xBL2ncUMLdZYGA8hZQjx9ICo96/3CH5shxrFrDwKeswfpM5sA8MDPQAsY255h2iQB8Dq1JYPUsW+6UFWS7VnbVcE0eq4mX85cIR2FmFZxGjv/216KakuYBYv7lcXDZPCtWGk1k8VMpNOMPElIVoo5kVL3Gp6e48NJYKMKhulPB3aO8060hAd77FLsRB18Jx3fEonK093nVZx5vR34pFu0baoLYmZd9+4uiyvlTp6',
      entryPoint: 'http://localhost:4000/api/saml/sso',
      wantAssertionsSigned: false,
    });
  }

  async validate(profile: Profile) {
    try {
      console.log('-------------> profile:', profile);
      return {
        email: profile.email,
        id: profile.id,
      };
    } catch (e) {
      throw new ForbiddenException('invalid user attributes');
    }
  }
}
