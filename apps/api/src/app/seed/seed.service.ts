import { Injectable } from '@nestjs/common';
import { SessionsSeeder } from './seeders/sessions.seeder';
import { UserSessionsSeeder } from './seeders/user-sessions.seeder';
import { UsersSeeder } from './seeders/users.seeder';
import { MediaSeeder } from './seeders/media.seeder';
import { MarkersSeeder } from './seeders/markers.seeder';

@Injectable()
export class SeedService {
  constructor(
    private readonly usersSeeder: UsersSeeder,
    private readonly mediaSeeder: MediaSeeder,
    private readonly sessionsSeeder: SessionsSeeder,
    private readonly userSessionSeeder: UserSessionsSeeder,
    private readonly markersSeeder: MarkersSeeder
  ) {}

  async seed() {
    const media = await this.mediaSeeder.seed();
    const users = await this.usersSeeder.seed();
    const markers = await this.markersSeeder.seed();
    const sessions = await this.sessionsSeeder.seed({
      users,
      markers,
    });
    await this.userSessionSeeder.seed({
      users,
      sessions,
    });
  }
}
