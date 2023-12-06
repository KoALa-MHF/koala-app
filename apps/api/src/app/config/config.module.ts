import { TypedConfigModule, fileLoader, selectConfig, dotenvLoader } from 'nest-typed-config';
import { Config, DatabaseConfig, MailConfig, SamlConfig, AuthConfig } from './config';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

const normalizeSamlConfig = (samlConfig) => {
  samlConfig.wantAuthnResponseSigned =
    samlConfig.wantAuthnResponseSigned === 'true' || samlConfig.wantAuthnResponseSigned === true;
  samlConfig.wantAssertionsSigned =
    samlConfig.wantAssertionsSigned === 'true' || samlConfig.wantAssertionsSigned === true;
  samlConfig.identifierFormat = samlConfig.identifierFormat === 'null' ? null : samlConfig.identifierFormat;
  samlConfig.acceptedClockSkewMs =
    typeof samlConfig.acceptedClockSkewMs !== 'undefined' ? parseInt(samlConfig.acceptedClockSkewMs, 10) : undefined;
};

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
    // Mail
    config.mail.port = parseInt(config.mail.port, 10);

    // Database
    const synchronizeDB = config.database.synchronize;
    config.database.synchronize = synchronizeDB === 'true' || synchronizeDB === true;
    const dropSchemaDB = config.database.dropSchema;
    config.database.dropSchema = dropSchemaDB === 'true' || dropSchemaDB === true;
    // SAML
    normalizeSamlConfig(config.saml);

    // SAML Option (for the second SAML provider)
    normalizeSamlConfig(config.samlOption);

    return config;
  },
});

export const config = selectConfig(ConfigModule, Config);
export const databaseConfig = selectConfig(ConfigModule, DatabaseConfig);
export const mailConfig = selectConfig(ConfigModule, MailConfig);
export const samlConfig = selectConfig(ConfigModule, SamlConfig);
export const authConfig = selectConfig(ConfigModule, AuthConfig);
