import { Injectable } from '@nestjs/common';
import { SessionsSeeder } from './seeders/sessions.seeder';
import { UserSessionsSeeder } from './seeders/user-sessions.seeder';
import { UsersSeeder } from './seeders/users.seeder';

@Injectable()
export class SeedService {
  constructor(
    private readonly usersSeeder: UsersSeeder,
    private readonly sessionsSeeder: SessionsSeeder,
    private readonly userSessionSeeder: UserSessionsSeeder
  ) {}

  async seed() {
    const users = await this.usersSeeder.seed();
    const sessions = await this.sessionsSeeder.seed({
      users,
    });
    await this.userSessionSeeder.seed({
      users,
      sessions,
    });
  }
}
