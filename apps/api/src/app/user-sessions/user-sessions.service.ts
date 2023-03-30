import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationError } from 'class-validator';
import { EntityNotFoundError, In, Repository } from 'typeorm';
import { ValidationErrorException } from '../core/exceptions/validation-error.exception';
import { CreateUserSessionInput } from './dto/create-user-session.input';
import { UpdateUserSessionInput } from './dto/update-user-session.input';
import { UserSession } from './entities/user-session.entity';

@Injectable()
export class UserSessionsService {
  constructor(
    @InjectRepository(UserSession)
    private userSessionsRepository: Repository<UserSession>,
    private readonly mailerService: MailerService
  ) {}

  async invite(ids: number[], message?: string): Promise<UserSession[]> {
    const userSessions = await this.userSessionsRepository.find({
      where: { id: In(ids) },
      relations: {
        session: true,
      },
    });
    for (const userSession of userSessions) {
      try {
        await this.mailerService.sendMail({
          to: userSession.email,
          subject: `Einladung zur KoALa Session ${userSession.session.name}`,
          template: 'session-invite',
          context: {
            sessionName: userSession.session.name,
            code: userSession.session.code,
            message: message,
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
      const userSession = this.userSessionsRepository.create({
        note: createUserSessionInput.note,
        email: createUserSessionInput.email,
        session: {
          id: createUserSessionInput.sessionId,
        },
      });

      return await this.userSessionsRepository.save(userSession);
    } catch (error) {
      if (error.message?.includes('UNIQUE constraint failed: user_session.email')) {
        const validationError = new ValidationError();
        validationError.property = 'email';
        validationError.constraints = { isUnique: 'email must be unique' };
        throw new ValidationErrorException(validationError);
      } else {
        throw error;
      }
    }
  }

  findAll(sessionId?: number): Promise<UserSession[]> {
    return this.userSessionsRepository.find({
      where: {
        sessionId,
      },
    });
  }

  findOne(id: number): Promise<UserSession> {
    return this.userSessionsRepository.findOneByOrFail({ id });
  }

  findOneByCode(code: string): Promise<UserSession> {
    return this.userSessionsRepository.findOneByOrFail({
      code,
    });
  }

  async update(id: number, updateUserSessionInput: UpdateUserSessionInput): Promise<UserSession> {
    try {
      await this.userSessionsRepository.update(id, {
        note: updateUserSessionInput.note,
        // email: updateUserSessionInput.email, -> needs to be deleted
      });

      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async remove(id: number) {
    const userSession = await this.findOne(id);
    await this.userSessionsRepository.delete(id);

    return userSession;
  }
}
