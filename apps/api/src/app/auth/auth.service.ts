import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityNotFoundError } from 'typeorm';
import { SessionsService } from '../sessions/sessions.service';
import { CreateUserSessionInput } from '../user-sessions/dto/create-user-session.input';
import { UserSessionsService } from '../user-sessions/user-sessions.service';
import { User } from '../users/entities/user.entity';
import { Authentication } from './models/autentication.model';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly sessionService: SessionsService,
    private readonly userSessionService: UserSessionsService
  ) {}

  async authenticateUserSession(code: string): Promise<Authentication> {
    try {
      const userSession = await this.userSessionService.findOneByCode(code);
      return this.getAuthentication(userSession.ownerId);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new UnauthorizedException();
      }
      throw error;
    }
  }

  async authenticateSession(code: string): Promise<Authentication> {
    try {
      const session = await this.sessionService.findOneByCode(code);

      const userSession = await this.userSessionService.create({
        sessionId: session.id,
      } as CreateUserSessionInput);

      return this.getAuthentication(userSession.ownerId);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new UnauthorizedException();
      }
      throw error;
    }
  }

  async authenticateSamlUser(user: User): Promise<Authentication> {
    if (!user.samlId) {
      throw new Error('Only users with a connected SAML ID can be authenticated');
    }
    return this.getAuthentication(user.id);
  }

  private async getAuthentication(userId: number): Promise<Authentication> {
    const accessToken = await this.getAccessToken(userId);
    return {
      accessToken,
      userId,
    } as Authentication;
  }

  private async getAccessToken(userId: number): Promise<string> {
    const payload = {
      sub: userId,
    };
    return await this.jwtService.signAsync(payload);
  }
}
