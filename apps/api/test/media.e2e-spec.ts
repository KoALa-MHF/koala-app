import * as supertest from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { setupTestApplication } from './mocks/test.util';
import { UsersData } from '../src/app/seed/data/users.data';

describe('Media (e2e) - REST', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupTestApplication();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Media GET', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      await supertest(app.getHttpServer()).get('/api/media/1').expect(HttpStatus.UNAUTHORIZED);
    });

    it('Authenticated user should get media file', async () => {
      await supertest(app.getHttpServer())
        .get('/api/media/1')
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .expect(HttpStatus.OK);
    });
  });
});
