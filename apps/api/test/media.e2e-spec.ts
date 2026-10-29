import * as supertest from 'supertest';
import request from 'supertest-graphql';
import gql from 'graphql-tag';

import { readFile, unlink } from 'node:fs/promises';
import { resolve } from 'path';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { setupTestApplication } from './mocks/test.util';
import { UsersData } from '../src/app/seed/data/users.data';
import { getFilePath } from '../src/app/media/media.util';

// see seed data: media 1 belongs to session 1, media 2 to annotation 1 of participant 1 (session 1)
const SESSION_MEDIA_ID = 1;
const ANNOTATION_MEDIA_ID = 2;
// the first media created by a test gets the next free id
const NEW_MEDIA_ID = 3;
const UPLOAD_FILE_PATH = resolve(__dirname, '../src/app/seed/data/media/test.mp3');
const UPLOAD_FILE_NAME = 'upload.mp3';

describe('Media (e2e) - REST', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupTestApplication();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Media GET', () => {
    it('Former media endpoint should not exist anymore', async () => {
      await supertest(app.getHttpServer())
        .get(`/api/media/${SESSION_MEDIA_ID}`)
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('Session Media GET', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      await supertest(app.getHttpServer()).get('/api/sessions/1/media').expect(HttpStatus.UNAUTHORIZED);
    });

    it('Session owner should get media file', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/api/sessions/1/media')
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .expect(HttpStatus.OK);

      expect(response.headers['content-type']).toEqual('audio/mpeg');
      expect(response.headers['content-length']).toEqual('158848');
      expect(response.headers['cache-control']).toEqual('no-cache');
      expect(response.body).toEqual(await readFile(getFilePath(SESSION_MEDIA_ID, 'test.mp3')));
    });

    it('Session participant should get media file', async () => {
      await supertest(app.getHttpServer())
        .get('/api/sessions/1/media')
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .expect(HttpStatus.OK);
    });

    it('User who is not part of the session should get "Not Found"', async () => {
      await supertest(app.getHttpServer())
        .get('/api/sessions/1/media')
        .auth(`${UsersData.sessionOwner2.id}`, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Session without media should return "Not Found"', async () => {
      await supertest(app.getHttpServer())
        .get('/api/sessions/3/media')
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Session media with a missing file should return "Not Found"', async () => {
      await unlink(getFilePath(SESSION_MEDIA_ID, 'test.mp3'));

      await supertest(app.getHttpServer())
        .get('/api/sessions/1/media')
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Invalid session id should return "Bad Request"', async () => {
      await supertest(app.getHttpServer())
        .get('/api/sessions/does_not_exist/media')
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Annotation Media GET', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      await supertest(app.getHttpServer()).get('/api/annotations/1/media').expect(HttpStatus.UNAUTHORIZED);
    });

    it('Annotation owner should get media file', async () => {
      const response = await supertest(app.getHttpServer())
        .get('/api/annotations/1/media')
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .expect(HttpStatus.OK);

      expect(response.headers['content-type']).toEqual('audio/mpeg');
      expect(response.body).toEqual(await readFile(getFilePath(ANNOTATION_MEDIA_ID, 'test.mp3')));
    });

    it('Session owner should get media file', async () => {
      await supertest(app.getHttpServer())
        .get('/api/annotations/1/media')
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .expect(HttpStatus.OK);
    });

    it('Other participant of the session should get "Forbidden"', async () => {
      await supertest(app.getHttpServer())
        .get('/api/annotations/1/media')
        .auth(`${UsersData.sessionParticipant2.id}`, { type: 'bearer' })
        .expect(HttpStatus.FORBIDDEN);
    });

    it('User who is not part of the session should get "Forbidden"', async () => {
      await supertest(app.getHttpServer())
        .get('/api/annotations/1/media')
        .auth(`${UsersData.sessionOwner2.id}`, { type: 'bearer' })
        .expect(HttpStatus.FORBIDDEN);
    });

    it('Not existing annotation should return "Not Found"', async () => {
      await supertest(app.getHttpServer())
        .get('/api/annotations/999/media')
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});

describe('Media (e2e) - GraphQL', () => {
  const CREATE_SESSION_MEDIA = `
    mutation CreateSessionMedia($id: Int!, $createMediaInput: CreateMediaInput!) {
      createSessionMedia(id: $id, createMediaInput: $createMediaInput) {
        id
        media {
          id
          name
        }
      }
    }
  `;

  const CREATE_ANNOTATION_MEDIA = `
    mutation CreateAnnotationMedia($id: Int!, $createMediaInput: CreateMediaInput!) {
      createAnnotationMedia(id: $id, createMediaInput: $createMediaInput) {
        id
        media {
          id
          name
        }
      }
    }
  `;

  const CREATE_SESSION_EXTERNAL_MEDIA = gql`
    mutation CreateSessionExternalMedia($id: Int!, $createExternalMediaInput: CreateExternalMediaInput!) {
      createSessionExternalMedia(id: $id, createExternalMediaInput: $createExternalMediaInput) {
        id
        media {
          name
          mimeType
        }
      }
    }
  `;

  const REMOVE_SESSION_MEDIA = gql`
    mutation RemoveSessionMedia($id: Int!) {
      removeSessionMedia(id: $id) {
        id
        media {
          id
        }
      }
    }
  `;

  const UPDATE_SESSION = gql`
    mutation UpdateSession($id: Int!, $updateSessionInput: UpdateSessionInput!) {
      updateSession(id: $id, updateSessionInput: $updateSessionInput) {
        id
      }
    }
  `;

  const CREATE_ANNOTATION = gql`
    mutation CreateAnnotation($createAnnotationInput: CreateAnnotationInput!) {
      createAnnotation(createAnnotationInput: $createAnnotationInput) {
        id
      }
    }
  `;

  const UPDATE_ANNOTATION = gql`
    mutation UpdateAnnotation($id: Int!, $updateAnnotationInput: UpdateAnnotationInput!) {
      updateAnnotation(id: $id, updateAnnotationInput: $updateAnnotationInput) {
        id
      }
    }
  `;

  const REMOVE_ANNOTATION_MEDIA = gql`
    mutation RemoveAnnotationMedia($id: Int!) {
      removeAnnotationMedia(id: $id) {
        id
      }
    }
  `;

  const REMOVE_ANNOTATION = gql`
    mutation RemoveAnnotation($id: Int!) {
      removeAnnotation(id: $id) {
        id
      }
    }
  `;

  const CREATE_MEDIA = gql`
    mutation CreateMedia($createMediaInput: CreateMediaInput!) {
      createMedia(createMediaInput: $createMediaInput) {
        id
      }
    }
  `;

  const DELETE_MEDIA = gql`
    mutation DeleteMedia($id: Float!) {
      deleteMedia(id: $id) {
        id
      }
    }
  `;

  let app: INestApplication;

  // uploads the test file as multipart request, see https://github.com/jaydenseric/graphql-multipart-request-spec
  function uploadMedia(query: string, id: number, userId?: number) {
    const uploadRequest = supertest(app.getHttpServer())
      .post('/graphql')
      .set('apollo-require-preflight', 'true')
      .field('operations', JSON.stringify({ query, variables: { id, createMediaInput: { file: null } } }))
      .field(
        'map',
        JSON.stringify({
          file: [
            'variables.createMediaInput.file',
          ],
        })
      )
      .attach('file', UPLOAD_FILE_PATH, UPLOAD_FILE_NAME);

    return userId ? uploadRequest.auth(`${userId}`, { type: 'bearer' }) : uploadRequest;
  }

  beforeEach(async () => {
    app = await setupTestApplication();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Create Session Media', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { body } = await uploadMedia(CREATE_SESSION_MEDIA, 1);

      expect(body.errors).toHaveLength(1);
      expect(body.errors[0].message).toBe('Unauthorized');
    });

    it('User who is not the session owner should get "Not Found"', async () => {
      const { body } = await uploadMedia(CREATE_SESSION_MEDIA, 1, UsersData.sessionOwner2.id);

      expect(body.errors).toHaveLength(1);
      expect(body.errors[0].message).toBe('Not Found');
      await readFile(getFilePath(SESSION_MEDIA_ID, 'test.mp3'));
    });

    it('Session owner should replace the session media and the previous file should be removed', async () => {
      const { body } = await uploadMedia(CREATE_SESSION_MEDIA, 1, UsersData.sessionOwner1.id);

      expect(body.errors).toBeUndefined();
      expect(body.data).toEqual({
        createSessionMedia: { id: '1', media: { id: `${NEW_MEDIA_ID}`, name: UPLOAD_FILE_NAME } },
      });
      await expect(readFile(getFilePath(SESSION_MEDIA_ID, 'test.mp3'))).rejects.toThrow('ENOENT');

      const response = await supertest(app.getHttpServer())
        .get('/api/sessions/1/media')
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(await readFile(UPLOAD_FILE_PATH));
    });
  });

  describe('Create Session External Media', () => {
    it('Session owner should replace the session media with an external media', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(CREATE_SESSION_EXTERNAL_MEDIA)
        .variables({ id: 1, createExternalMediaInput: { url: 'https://www.youtube.com/watch?v=abc123' } })
        .expectNoErrors();

      expect(data).toEqual({
        createSessionExternalMedia: {
          id: '1',
          media: { name: 'https://www.youtube.com/embed/abc123', mimeType: 'external/youtube' },
        },
      });
      await expect(readFile(getFilePath(SESSION_MEDIA_ID, 'test.mp3'))).rejects.toThrow('ENOENT');

      await supertest(app.getHttpServer())
        .get('/api/sessions/1/media')
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('User who is not the session owner should get "Not Found"', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner2.id}`, { type: 'bearer' })
        .mutate(CREATE_SESSION_EXTERNAL_MEDIA)
        .variables({ id: 1, createExternalMediaInput: { url: 'https://www.youtube.com/watch?v=abc123' } });

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Not Found');
    });
  });

  describe('Remove Session Media', () => {
    it('Session owner should remove the session media including its file', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(REMOVE_SESSION_MEDIA)
        .variables({ id: 1 })
        .expectNoErrors();

      expect(data).toEqual({ removeSessionMedia: { id: '1', media: null } });
      await expect(readFile(getFilePath(SESSION_MEDIA_ID, 'test.mp3'))).rejects.toThrow('ENOENT');

      await supertest(app.getHttpServer())
        .get('/api/sessions/1/media')
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Session owner should be able to remove the session media even if the file is already missing', async () => {
      await unlink(getFilePath(SESSION_MEDIA_ID, 'test.mp3'));

      await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(REMOVE_SESSION_MEDIA)
        .variables({ id: 1 })
        .expectNoErrors();
    });

    it('User who is not the session owner should get "Not Found"', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner2.id}`, { type: 'bearer' })
        .mutate(REMOVE_SESSION_MEDIA)
        .variables({ id: 1 });

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Not Found');
      await readFile(getFilePath(SESSION_MEDIA_ID, 'test.mp3'));
    });

    it('Archiving a session should remove its media file', async () => {
      await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(UPDATE_SESSION)
        .variables({ id: 1, updateSessionInput: { status: 'ARCHIVED' } })
        .expectNoErrors();

      // media is removed asynchronously after the session got updated
      await new Promise((resolve) => setTimeout(resolve, 100));

      await expect(readFile(getFilePath(SESSION_MEDIA_ID, 'test.mp3'))).rejects.toThrow('ENOENT');
    });
  });

  describe('Create Annotation Media', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { body } = await uploadMedia(CREATE_ANNOTATION_MEDIA, 1);

      expect(body.errors).toHaveLength(1);
      expect(body.errors[0].message).toBe('Unauthorized');
    });

    it('Not registered annotation owner should upload an audio comment and replace the previous file', async () => {
      const { body } = await uploadMedia(CREATE_ANNOTATION_MEDIA, 1, UsersData.sessionParticipant1.id);

      expect(body.errors).toBeUndefined();
      expect(body.data).toEqual({
        createAnnotationMedia: { id: 1, media: { id: `${NEW_MEDIA_ID}`, name: UPLOAD_FILE_NAME } },
      });
      await expect(readFile(getFilePath(ANNOTATION_MEDIA_ID, 'test.mp3'))).rejects.toThrow('ENOENT');
    });

    it('Session owner should not be able to upload an audio comment for an annotation of a participant', async () => {
      const { body } = await uploadMedia(CREATE_ANNOTATION_MEDIA, 1, UsersData.sessionOwner1.id);

      expect(body.errors).toHaveLength(1);
      expect(body.errors[0].message).toBe('Forbidden');
      await readFile(getFilePath(ANNOTATION_MEDIA_ID, 'test.mp3'));
    });

    it('Annotation owner should upload an audio comment and replacing it should remove the previous file', async () => {
      // user session 1 belongs to session owner 1 in session 1
      const { data } = await request<{ createAnnotation: { id: string } }>(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(CREATE_ANNOTATION)
        .variables({ createAnnotationInput: { start: 100, markerId: 1, userSessionId: 1 } })
        .expectNoErrors();
      const annotationId = parseInt(data.createAnnotation.id);

      const firstUpload = await uploadMedia(CREATE_ANNOTATION_MEDIA, annotationId, UsersData.sessionOwner1.id);
      expect(firstUpload.body.errors).toBeUndefined();
      expect(firstUpload.body.data).toEqual({
        createAnnotationMedia: { id: annotationId, media: { id: `${NEW_MEDIA_ID}`, name: UPLOAD_FILE_NAME } },
      });

      const secondUpload = await uploadMedia(CREATE_ANNOTATION_MEDIA, annotationId, UsersData.sessionOwner1.id);
      expect(secondUpload.body.errors).toBeUndefined();
      expect(secondUpload.body.data.createAnnotationMedia.media.id).toBe(`${NEW_MEDIA_ID + 1}`);
      await expect(readFile(getFilePath(NEW_MEDIA_ID, UPLOAD_FILE_NAME))).rejects.toThrow('ENOENT');

      const response = await supertest(app.getHttpServer())
        .get(`/api/annotations/${annotationId}/media`)
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .expect(HttpStatus.OK);

      expect(response.body).toEqual(await readFile(UPLOAD_FILE_PATH));
    });
  });

  describe('Remove Annotation Media', () => {
    it('Annotation owner should remove the audio comment including its file', async () => {
      await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .mutate(REMOVE_ANNOTATION_MEDIA)
        .variables({ id: 1 })
        .expectNoErrors();

      await expect(readFile(getFilePath(ANNOTATION_MEDIA_ID, 'test.mp3'))).rejects.toThrow('ENOENT');

      await supertest(app.getHttpServer())
        .get('/api/annotations/1/media')
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Removing the annotation should remove the audio comment file', async () => {
      await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .mutate(REMOVE_ANNOTATION)
        .variables({ id: 1 })
        .expectNoErrors();

      await expect(readFile(getFilePath(ANNOTATION_MEDIA_ID, 'test.mp3'))).rejects.toThrow('ENOENT');
    });

    it('Annotations removed by a new earlier annotation should remove their audio comment files', async () => {
      // annotation 1 starts at 200 with marker 1, so it is in the future of the new annotation
      await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .mutate(CREATE_ANNOTATION)
        .variables({ createAnnotationInput: { start: 100, value: 1, markerId: 1, userSessionId: 6 } })
        .expectNoErrors();

      await expect(readFile(getFilePath(ANNOTATION_MEDIA_ID, 'test.mp3'))).rejects.toThrow('ENOENT');
    });

    it('Other user should not be able to remove the audio comment', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant2.id}`, { type: 'bearer' })
        .mutate(REMOVE_ANNOTATION_MEDIA)
        .variables({ id: 1 });

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden');

      await readFile(getFilePath(ANNOTATION_MEDIA_ID, 'test.mp3'));
    });
  });

  describe('Removed Media API', () => {
    it('Media should not be creatable without a session or annotation', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(CREATE_MEDIA)
        .variables({ createMediaInput: { file: null } });

      expect(errors[0].message).toContain('Cannot query field "createMedia"');
    });

    it('Media should not be deletable by id', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(DELETE_MEDIA)
        .variables({ id: SESSION_MEDIA_ID });

      expect(errors[0].message).toContain('Cannot query field "deleteMedia"');
      await readFile(getFilePath(SESSION_MEDIA_ID, 'test.mp3'));
    });

    it('Media id should not be assignable to a session', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(UPDATE_SESSION)
        .variables({ id: 3, updateSessionInput: { mediaId: SESSION_MEDIA_ID } });

      expect(errors[0].message).toContain('"mediaId" is not defined');
    });

    it('Media id should not be assignable to an annotation', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .mutate(UPDATE_ANNOTATION)
        .variables({ id: 1, updateAnnotationInput: { mediaId: SESSION_MEDIA_ID } });

      expect(errors[0].message).toContain('"mediaId" is not defined');
    });
  });
});
