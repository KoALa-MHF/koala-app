import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSession } from '../../user-sessions/entities/user-session.entity';
import { SeederInterface, SeederOptions } from '../seeder.interface';
import { UserSessionsData } from '../data/user-sessions.data';

@Injectable()
export class UserSessionsSeeder implements SeederInterface<UserSession> {
  constructor(
    @InjectRepository(UserSession)
    private userSessionRepository: Repository<UserSession>
  ) {}

  async seed(options: SeederOptions): Promise<UserSession[]> {
    const userSessions: Partial<UserSession>[] = [];

    for (let i = 0; i < UserSessionsData.length; i++) {
      const userSessionData = UserSessionsData[i];
      userSessions.push(this.userSessionRepository.create(userSessionData));
    }

    return await this.userSessionRepository.save(userSessions);
  }
}
