import * as supertest from 'supertest';
import request from 'supertest-graphql';
import gql from 'graphql-tag';

import { unlink } from 'node:fs/promises';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { setupTestApplication } from './mocks/test.util';
import { UsersData } from '../src/app/seed/data/users.data';
import { getFilePath } from '../src/app/media/media.util';

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

describe('Media (e2e) - GraphQL', () => {
  const DELETE_MEDIA = gql`
    mutation DeleteMedia($id: Float!) {
      deleteMedia(id: $id) {
        id
        name
        mimeType
      }
    }
  `;

  const DELETE_MEDIA_VARIABLES = {
    id: 1,
  };

  let app: INestApplication;

  beforeEach(async () => {
    app = await setupTestApplication();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Delete Media', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { errors } = await request(app.getHttpServer()).mutate(DELETE_MEDIA).variables(DELETE_MEDIA_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Unauthorized');
    });

    it('Authenticated user should be able to delete a media item even if the file is already missing and session still references it', async () => {
      const filePath = getFilePath(DELETE_MEDIA_VARIABLES.id, 'test.mp3');
      await unlink(filePath);

      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(DELETE_MEDIA)
        .variables(DELETE_MEDIA_VARIABLES)
        .expectNoErrors();

      expect(data).toMatchSnapshot();
    });

    it('Authenticated user should be able to delete a media item', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(DELETE_MEDIA)
        .variables(DELETE_MEDIA_VARIABLES)
        .expectNoErrors();

      expect(data).toMatchSnapshot();
    });
  });
});
