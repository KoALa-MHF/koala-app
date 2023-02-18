import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class MailConfig {
  @IsString()
  public readonly host: string = 'localhost';

  @IsNumber()
  public readonly port: number = 1025;

  @IsString()
  @IsOptional()
  public readonly user?: string;

  @IsString()
  @IsOptional()
  public readonly password?: string;

  @IsString()
  public readonly from: string = '"Koala App" <noreply@koalaapp.de>';
}

export class DatabaseConfig {
  @IsString()
  public readonly name: string = 'koala';
}

export class Config {
  @Type(() => DatabaseConfig)
  @ValidateNested()
  public readonly database: DatabaseConfig = new DatabaseConfig();

  @Type(() => MailConfig)
  @ValidateNested()
  public readonly mail: MailConfig = new MailConfig();
}
