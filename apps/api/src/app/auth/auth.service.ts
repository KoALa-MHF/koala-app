import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  getAccessToken(payload: any) {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
