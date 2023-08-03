import { MailerService } from '@nestjs-modules/mailer';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationError } from 'class-validator';
import { In, IsNull, Not, Repository } from 'typeorm';
import { ValidationErrorException } from '../core/exceptions/validation-error.exception';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserSessionInput } from './dto/create-user-session.input';
import { UpdateUserSessionInput } from './dto/update-user-session.input';
import { UserSession } from './entities/user-session.entity';
import { escapeExpression } from 'handlebars';
import { config } from '../config/config.module';

const UNIQUE_USER_CONSTRAINT_ERROR = 'UNIQUE constraint failed: user_session.userId';

@Injectable()
export class UserSessionsService {
  constructor(
    @InjectRepository(UserSession)
    private userSessionsRepository: Repository<UserSession>,
    private readonly mailerService: MailerService,
    private readonly usersService: UsersService
  ) {}

  async invite(ids: number[], message?: string): Promise<UserSession[]> {
    const userSessions = await this.userSessionsRepository.find({
      where: {
        id: In(ids),
        owner: {
          email: Not(IsNull()),
        },
      },
      relations: {
        session: true,
        owner: true,
      },
    });

    message = escapeExpression(message || '');
    message = message.replace(/(\r\n|\n|\r)/gm, '<br>');

    for (const userSession of userSessions) {
      try {
        await this.mailerService.sendMail({
          to: userSession.owner.email,
          subject: `Einladung zur KoALa Session ${userSession.session.name}`,
          template: message ? 'session-invite-custom-message' : 'session-invite',
          context: {
            sessionName: userSession.session.name,
            ownerName: userSession.session.owner?.displayName || '',
            message: message,
            sessionUrl: config.koalaFrontendUrl + '?sessionCode=' + userSession.code,
            koalaLogoSrc: config.koalaAssetsUrl + 'koala-logo.png',
          },
        });
        userSession.invitedAt = new Date();
      } catch (error) {
        console.log("Invite User Session: Couldn't sent mail");
      }
    }

    return this.userSessionsRepository.save(userSessions);
  }

  async create(createUserSessionInput: CreateUserSessionInput): Promise<UserSession> {
    try {
      const email = createUserSessionInput.owner?.email;
      let user: User = await this.usersService.findByEmail(email);
      if (!user) {
        user = {
          email: email,
        } as User;
      }

      const userSession = this.userSessionsRepository.create({
        note: createUserSessionInput.note,
        session: {
          id: createUserSessionInput.sessionId,
        },
        owner: user,
      });

      return await this.userSessionsRepository.save(userSession);
    } catch (error) {
      if (error.message?.includes(UNIQUE_USER_CONSTRAINT_ERROR)) {
        const validationError = new ValidationError();
        validationError.property = 'user';
        validationError.constraints = { isUnique: 'user must be unique per session' };
        throw new ValidationErrorException(validationError);
      } else {
        throw error;
      }
    }
  }

  findAll(user: User): Promise<UserSession[]> {
    return this.userSessionsRepository.findBy({
      ownerId: user.id,
    });
  }

  findAllBySession(sessionId: number, user?: User): Promise<UserSession[]> {
    return this.userSessionsRepository.find({
      where: [
        {
          sessionId: sessionId,
          ownerId: user?.id,
        },
        {
          sessionId: sessionId,
          session: {
            ownerId: user?.id,
          },
        },
      ],
    });
  }

  async findOne(id: number, user?: User): Promise<UserSession> {
    const userSession = await this.userSessionsRepository.findOneBy({ id });

    if (!userSession) {
      throw new NotFoundException();
    }

    if (user && userSession.ownerId !== user.id) {
      throw new ForbiddenException();
    }

    return userSession;
  }

  findOneByCode(code: string): Promise<UserSession> {
    return this.userSessionsRepository.findOneByOrFail({ code });
  }

  async update(id: number, updateUserSessionInput: UpdateUserSessionInput, user: User): Promise<UserSession> {
    const userSession = await this.findOne(id, user);

    this.userSessionsRepository.merge(userSession, {
      note: updateUserSessionInput.note,
    });

    return this.userSessionsRepository.save(userSession);
  }

  async remove(id: number, user: User) {
    const userSession = await this.findOneWithSessionData(id);

    if (userSession.session.ownerId !== user.id && userSession.ownerId !== user.id) {
      //only the session owner or the userSession owner are allowed to delete the user session
      throw new ForbiddenException();
    }

    await this.anonymizeUserSession(id, user);

    await this.userSessionsRepository.softRemove(userSession);

    return userSession;
  }

  private async findOneWithSessionData(id: number, user?: User) {
    const userSession = await this.userSessionsRepository.findOne({
      where: { id },
      relations: {
        session: true,
      },
    });

    if (!userSession) {
      throw new NotFoundException();
    }

    if (user && userSession.ownerId !== user.id) {
      throw new ForbiddenException();
    }

    return userSession;
  }

  private async anonymizeUserSession(id: number, user: User) {
    const userSession = await this.findOne(id, user);

    this.userSessionsRepository.merge(userSession, {
      owner: null,
    });

    return this.userSessionsRepository.save(userSession);
  }
}
