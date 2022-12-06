import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Marker } from '../markers/entities/marker.entity';

import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';
import { Session } from './entities/session.entity';

const RELATIONS = [
  'media',
  'markers',
];

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>
  ) {}

  async create(createSessionInput: CreateSessionInput) {
    const newSession = this.sessionsRepository.create({
      ...createSessionInput,
      media: {
        id: createSessionInput.mediaId,
      },
    });

    const savedSession = await this.sessionsRepository.save(newSession);

    return this.findOne(savedSession.id);
  }

  findAll() {
    return this.sessionsRepository.find({
      relations: RELATIONS,
    });
  }

  findOne(id: number, withDeleted = false) {
    return this.sessionsRepository.findOneOrFail({
      where: { id },
      relations: RELATIONS,
      withDeleted,
    });
  }

  async update(id: number, updateSessionInput: UpdateSessionInput): Promise<Session> {
    try {
      await this.sessionsRepository.update(id, {
        ...updateSessionInput,
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

  async addMarker(id: number, markerId: number) {
    try {
      const session = await this.findOne(id);
      session.markers.push({ id: markerId } as Marker);
      await this.sessionsRepository.save(session);
      // load the current data, as save returns also the local manipulated data when relation already exists
      return this.findOne(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
