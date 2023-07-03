import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

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
  public readonly name: string = 'database/koala';

  @IsBoolean()
  public readonly synchronize: boolean = false;

  @IsBoolean()
  public readonly dropSchema: boolean = false;
}

export class SamlConfig {
  @IsString()
  public readonly issuer: string;

  @IsString()
  public readonly callbackUrl: string;

  @IsString()
  public readonly cert: string;

  @IsString()
  @IsUrl()
  public readonly entryPoint: string;

  @IsString()
  public readonly audience: string;

  @IsBoolean()
  public readonly wantAuthnResponseSigned: boolean = false;

  @IsString()
  public readonly redirectFrontendUrl: string;
}

export class Config {
  @Type(() => DatabaseConfig)
  @ValidateNested()
  public readonly database: DatabaseConfig = new DatabaseConfig();

  @Type(() => MailConfig)
  @ValidateNested()
  public readonly mail: MailConfig = new MailConfig();

  @Type(() => SamlConfig)
  @ValidateNested()
  public readonly saml: SamlConfig = new SamlConfig();

  @IsString()
  public readonly koalaFrontendUrl: string;

  @IsString()
  public readonly koalaAssetsUrl: string;
}
