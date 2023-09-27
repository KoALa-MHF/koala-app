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
  @IsOptional()
  public readonly audience: string;

  @IsBoolean()
  public readonly wantAuthnResponseSigned: boolean = false;

  @IsBoolean()
  public readonly wantAssertionsSigned: boolean = false;

  @IsString()
  public readonly redirectFrontendUrl: string;

  @IsString()
  @IsOptional()
  public readonly privateKeyPath: string;

  @IsString()
  @IsOptional()
  public readonly decryptionPvkPath: string;

  @IsString()
  @IsOptional()
  public readonly signatureAlgorithm: string;

  @IsNumber()
  @IsOptional()
  public readonly acceptedClockSkewMs: number;

  @IsString()
  @IsOptional()
  public readonly identifierFormat: string | null;
}

export class AuthConfig {
  @IsString()
  public readonly secret: string;

  @IsString()
  public readonly expiresIn: string = '24h';
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

  @Type(() => AuthConfig)
  @ValidateNested()
  public readonly auth: AuthConfig = new AuthConfig();

  @IsString()
  public readonly koalaFrontendUrl: string;

  @IsString()
  public readonly koalaAssetsUrl: string;

  @IsString()
  public readonly uploadFolderPath: string = './uploads';
}
