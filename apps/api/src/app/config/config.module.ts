import { TypedConfigModule, fileLoader, selectConfig, dotenvLoader } from 'nest-typed-config';
import { Config, DatabaseConfig, MailConfig } from './config';

export const ConfigModule = TypedConfigModule.forRoot({
  schema: Config,
  load: [
    fileLoader(),
    dotenvLoader({
      separator: '__',
    }),
  ],
});

export const config = selectConfig(ConfigModule, Config);
export const databaseConfig = selectConfig(ConfigModule, DatabaseConfig);
export const mailConfig = selectConfig(ConfigModule, MailConfig);
