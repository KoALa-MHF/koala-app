import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Toolbar } from '../toolbars/entities/toolbar.entity';
import { User } from '../users/entities/user.entity';

import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';
import { Session } from './entities/session.entity';
import { SetPlayModeInput } from './dto/set-play-mode.input';
import { SetPlayPositionInput } from './dto/set-play-position.input';

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
    return this.findOneOfOwner(savedSession.id, owner);
  }

  findAll(user: User): Promise<Session[]> {
    return this.sessionsRepository.find({
      where: [
        { ownerId: user.id },
        {
          userSessions: {
            ownerId: user.id,
          },
        },
      ],
    });
  }

  async findOne(id: number, user: User, withDeleted = false): Promise<Session> {
    const session = await this.sessionsRepository.findOne({
      where: [
        {
          id,
          ownerId: user.id,
        },
        {
          id,
          userSessions: {
            ownerId: user.id,
          },
        },
      ],
      withDeleted,
    });

    if (!session) {
      throw new NotFoundException();
    }

    return session;
  }

  async findOneOfOwner(id: number, owner: User, withDeleted = false): Promise<Session> {
    const session = await this.sessionsRepository.findOne({
      where: {
        id,
        ownerId: owner.id,
      },
      withDeleted,
    });

    if (!session) {
      throw new NotFoundException();
    }

    return session;
  }

  findOneByCode(code: string): Promise<Session> {
    return this.sessionsRepository.findOneBy({
      code,
    });
  }

  findOneByUserSessionCode(code: string): Promise<Session> {
    return this.sessionsRepository.findOneBy({
      userSessions: {
        code,
      },
    });
  }

  async update(id: number, updateSessionInput: UpdateSessionInput, owner: User): Promise<Session> {
    const session = await this.findOneOfOwner(id, owner);

    this.sessionsRepository.merge(session, {
      name: updateSessionInput.name,
      description: updateSessionInput.description,
      status: updateSessionInput.status,
      start: updateSessionInput.start,
      end: updateSessionInput.end,
      editable: updateSessionInput.editable,
      enablePlayer: updateSessionInput.enablePlayer,
      displaySampleSolution: updateSessionInput.displaySampleSolution,
      enableLiveAnalysis: updateSessionInput.enableLiveAnalysis,
      liveSessionStarted: updateSessionInput.liveSessionStarted,
      ...(updateSessionInput.mediaId && { media: { id: updateSessionInput.mediaId } }),
    });

    return this.sessionsRepository.save(session);
  }

  async setPlayMode(id: number, setPlayModeInput: SetPlayModeInput, owner: User): Promise<Session> {
    const session = await this.findOneOfOwner(id, owner);

    this.sessionsRepository.merge(session, {
      playMode: setPlayModeInput.playMode,
    });

    return this.sessionsRepository.save(session);
  }

  async setPlayPosition(id: number, setPlayModeInput: SetPlayPositionInput, owner: User): Promise<Session> {
    const session = await this.findOneOfOwner(id, owner);

    this.sessionsRepository.merge(session, {
      playPosition: setPlayModeInput.playPosition,
    });

    return this.sessionsRepository.save(session);
  }

  async remove(id: number, owner: User) {
    const session = await this.findOneOfOwner(id, owner);
    await this.sessionsRepository.softRemove(session);
    session.id = id;
    return session;
  }
}
