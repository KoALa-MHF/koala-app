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
      const response = await supertest(app.getHttpServer())
        .get('/api/media/1')
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .expect(HttpStatus.OK);

      expect(response.headers['content-type']).toEqual('audio/mpeg');
      expect(response.headers['content-length']).toEqual('158848');
      expect(response.headers['cache-control']).toEqual('no-cache');
      expect(response.body).toMatchSnapshot();
    });

    it('Authenticated user getting a media file which does not exist should return "Not Found"', async () => {
      await supertest(app.getHttpServer())
        .get('/api/media/does_not_exist')
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
