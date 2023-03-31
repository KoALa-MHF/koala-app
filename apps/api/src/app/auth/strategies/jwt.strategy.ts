import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';
import { Payload } from '../models/payload.model';
import { EntityNotFoundError } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jWTSecret', // TODO Move to config
    });
  }

  async validate(payload: Payload): Promise<User> {
    try {
      const user = await this.usersService.findOne(payload.sub);
      return user;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new UnauthorizedException();
      } else {
        throw error;
      }
    }
  }
}
