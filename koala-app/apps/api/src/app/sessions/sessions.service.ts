import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>
  ) {}

  create(createSessionInput: CreateSessionInput) {
    const newSession = this.sessionsRepository.create();
    newSession.name = createSessionInput.name;

    return this.sessionsRepository.save(newSession);
  }

  findAll() {
    return this.sessionsRepository.find();
  }

  findOne(id: number) {
    return this.sessionsRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateSessionInput: UpdateSessionInput) {
    try {
      await this.sessionsRepository.update(updateSessionInput.id, {
        name: updateSessionInput.name,
      });

      const updatedData = await this.sessionsRepository.findBy({
        id: updateSessionInput.id,
      });

      //graphql expects single object, not array
      return updatedData[0];
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  remove(id: number) {
    return this.sessionsRepository.delete(id);
  }
}
