import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserSessionInput } from './dto/create-user-session.input';
import { UpdateUserSessionInput } from './dto/update-user-session.input';
import { UserSession } from './entities/user-session.entity';

@Injectable()
export class UserSessionsService {
  constructor(
    @InjectRepository(UserSession)
    private userSessionsRepository: Repository<UserSession>
  ) {}

  create(createUserSessionInput: CreateUserSessionInput) {
    const userSession = this.userSessionsRepository.create({
      session : {
        id : createUserSessionInput.sessionId
      }
    });
    return this.userSessionsRepository.save(userSession);
  }

  findAll() {
    return this.userSessionsRepository.find();
  }

  findOne(id: number) {
    return this.userSessionsRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateUserSessionInput: UpdateUserSessionInput) {
    try {
      await this.userSessionsRepository.update(id, {
        note: updateUserSessionInput.note
      });

      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  remove(id: number) {
    return this.userSessionsRepository.delete(id);
  }
}
