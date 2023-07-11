import { Injectable } from '@nestjs/common';
import { JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
export class JwtServiceMock {
  verify(token: string, options: JwtVerifyOptions): any {
    return {
      sub: token,
    };
  }
}
