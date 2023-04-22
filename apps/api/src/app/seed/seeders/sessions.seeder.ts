import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../../sessions/entities/session.entity';
import { faker } from '@faker-js/faker';
import { SeederInterface, SeederOptions } from '../seeder.interface';

@Injectable()
export class SessionsSeeder implements SeederInterface<Session> {
  constructor(
    @InjectRepository(Session)
    private sessionsRepository: Repository<Session>
  ) {}

  async seed(options: SeederOptions): Promise<Session[]> {
    const sessions: Partial<Session>[] = [];
    for (let i = 0; i < 3; i++) {
      sessions.push(
        this.sessionsRepository.create({
          name: faker.commerce.productName(),
          owner: options.users[i],
        })
      );
    }
    return await this.sessionsRepository.save(sessions);
  }
}
