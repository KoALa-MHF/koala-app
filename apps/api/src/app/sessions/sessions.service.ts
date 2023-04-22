import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Toolbar } from '../toolbars/entities/toolbar.entity';
import { User } from '../users/entities/user.entity';

import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>
  ) {}

  async create(createSessionInput: CreateSessionInput, owner: User): Promise<Session> {
    const newSession = this.sessionsRepository.create({
      ...createSessionInput,
      media: {
        id: createSessionInput.mediaId,
      },
      toolbars: [
        new Toolbar(),
      ],
      owner: owner,
    });

    const savedSession = await this.sessionsRepository.save(newSession);
    return this.findOne(savedSession.id);
  }

  findAll(owner: User): Promise<Session[]> {
    return this.sessionsRepository.findBy({
      ownerId: owner.id,
    });
  }

  findOne(id: number, withDeleted = false): Promise<Session> {
    return this.sessionsRepository.findOneOrFail({
      where: { id },
      withDeleted,
    });
  }

  findOneByCode(code: string): Promise<Session> {
    return this.sessionsRepository.findOneByOrFail({
      code,
    });
  }

  async update(id: number, updateSessionInput: UpdateSessionInput): Promise<Session> {
    try {
      await this.sessionsRepository.update(id, {
        name: updateSessionInput.name,
        description: updateSessionInput.description,
        status: updateSessionInput.status,
        start: updateSessionInput.start,
        end: updateSessionInput.end,
        editable: updateSessionInput.editable,
        enablePlayer: updateSessionInput.enablePlayer,
        displaySampleSolution: updateSessionInput.displaySampleSolution,
        enableLiveAnalysis: updateSessionInput.enableLiveAnalysis,
        ...(updateSessionInput.mediaId && { media: { id: updateSessionInput.mediaId } }),
      });

      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  async remove(id: number) {
    const deleteResult = await this.sessionsRepository.softDelete(id);

    if (deleteResult.affected === 1) {
      return this.findOne(id, true);
    } else {
      throw new NotFoundException();
    }
  }
}
