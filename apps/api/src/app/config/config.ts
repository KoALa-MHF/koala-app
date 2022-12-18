import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

export class DatabaseConfig {
  @IsString()
  public readonly name: string = 'koala';
}

export class Config {
  @Type(() => DatabaseConfig)
  @ValidateNested()
  public readonly database: DatabaseConfig = new DatabaseConfig();
}
