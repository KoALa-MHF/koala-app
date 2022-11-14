import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';
import { Session } from './entities/session.entity';

const RELATIONS = [ 'media' ];

@Injectable()
export class SessionsService {

  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>
  ) {}

  create(createSessionInput: CreateSessionInput) {
    const newSession = this.sessionsRepository.create();
    newSession.name = createSessionInput.name;
    newSession.description = createSessionInput.description;

    return this.sessionsRepository.save(newSession);
  }

  findAll() {
    return this.sessionsRepository.find({
      relations: RELATIONS
    });
  }

  findOne(id: number) {
    return this.sessionsRepository.findOneOrFail({
      where : {id},
      relations: RELATIONS
    });
  }

  async update(id: number, updateSessionInput: UpdateSessionInput) : Promise<Session> {
    try {
      await this.sessionsRepository.update(id, {
        name: updateSessionInput.name,
        description: updateSessionInput.description
      });

      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  remove(id: number) {
    return this.sessionsRepository.delete(id);
  }

  async setMedia(id: number, mediaId: number): Promise<Session> {
    try {
      await this.sessionsRepository.update(id, {
        media : {
          id : mediaId
        }
      });
      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }
}
