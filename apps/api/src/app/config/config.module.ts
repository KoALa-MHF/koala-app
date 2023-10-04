import { TypedConfigModule, fileLoader, selectConfig, dotenvLoader } from 'nest-typed-config';
import { Config, DatabaseConfig, MailConfig, SamlConfig, AuthConfig } from './config';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

export const ConfigModule = TypedConfigModule.forRoot({
  schema: Config,
  load: [
    fileLoader(),
    dotenvLoader({
      separator: '__',
    }),
  ],
  validate: (rawConfig: any) => {
    const config = plainToClass(Config, rawConfig);
    const schemaErrors = validateSync(config, {
      forbidUnknownValues: true,
      whitelist: true,
    });

    if (schemaErrors.length) {
      throw new Error(TypedConfigModule.getConfigErrorMessage(schemaErrors));
    }

    return config as Config;
  },
  normalize(config) {
    config.mail.port = parseInt(config.mail.port, 10);
    const synchronize = config.database.synchronize;
    config.database.synchronize = synchronize === 'true' || synchronize === true;
    const dropSchema = config.database.dropSchema;
    config.database.dropSchema = dropSchema === 'true' || dropSchema === true;
    const wantAuthnResponseSigned = config.saml.wantAuthnResponseSigned;
    config.saml.wantAuthnResponseSigned = wantAuthnResponseSigned === 'true' || wantAuthnResponseSigned === true;
    const wantAssertionsSigned = config.saml.wantAssertionsSigned;
    config.saml.wantAssertionsSigned = wantAssertionsSigned === 'true' || wantAssertionsSigned === true;
    const identifierFormat = config.saml.identifierFormat;
    config.saml.identifierFormat = identifierFormat === 'null' ? null : identifierFormat;
    const acceptedClockSkewMs = config.saml.acceptedClockSkewMs;
    config.saml.acceptedClockSkewMs =
      typeof acceptedClockSkewMs !== 'undefined' ? parseInt(acceptedClockSkewMs, 10) : undefined;
    return config;
  },
});

export const config = selectConfig(ConfigModule, Config);
export const databaseConfig = selectConfig(ConfigModule, DatabaseConfig);
export const mailConfig = selectConfig(ConfigModule, MailConfig);
export const samlConfig = selectConfig(ConfigModule, SamlConfig);
export const authConfig = selectConfig(ConfigModule, AuthConfig);
