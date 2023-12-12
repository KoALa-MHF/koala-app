import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Session } from '../../sessions/entities/session.entity';
import { SeederInterface, SeederOptions } from '../seeder.interface';
import { Toolbar } from '../../toolbars/entities/toolbar.entity';
import { SessionsData } from '../data/sessions.data';
import { UserSession } from '../../user-sessions/entities/user-session.entity';

@Injectable()
export class SessionsSeeder implements SeederInterface<Session> {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>
  ) {}

  async seed(options: SeederOptions): Promise<Session[]> {
    const sessions: Partial<Session>[] = [];

    for (const sessionData of SessionsData) {
      const userSession = new UserSession();
      userSession.ownerId = sessionData.owner.id;

      const toolbar = new Toolbar();
      toolbar.markers = [
        {
          markerId: 1,
          visible: true,
        },
      ];
      toolbar.markers.push({
        markerId: 2,
        visible: true,
      });
      toolbar.markers.push({
        markerId: 3,
        visible: true,
      });

      const session = {
        ...sessionData,
        toolbars: [
          toolbar,
        ],
        userSessions: [
          userSession,
        ],
      } as Partial<Session>;

      sessions.push(this.sessionsRepository.create(session));
    }
    return await this.sessionsRepository.save(sessions);
  }
}
