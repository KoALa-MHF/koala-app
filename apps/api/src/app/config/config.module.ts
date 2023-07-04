import { TypedConfigModule, fileLoader, selectConfig, dotenvLoader } from 'nest-typed-config';
import { Config, DatabaseConfig, MailConfig, SamlConfig } from './config';
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
    config.database.synchronize = (config.database.synchronize === 'true' || config.database.synchronize === true)
    config.database.dropSchema = (config.database.dropSchema === 'true' || config.database.dropSchema === true)
    return config;
  },
});

export const config = selectConfig(ConfigModule, Config);
export const databaseConfig = selectConfig(ConfigModule, DatabaseConfig);
export const mailConfig = selectConfig(ConfigModule, MailConfig);
export const samlConfig = selectConfig(ConfigModule, SamlConfig);
