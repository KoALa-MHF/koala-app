import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { INestApplication } from '@nestjs/common';
import { setupTestApplication } from './mocks/test.util';
import { UsersData } from '../src/app/seed/data/users.data';

const QUERY_ANNOTATION_COMMENTS = gql`
  query Annotation($id: Int!) {
    annotation(id: $id) {
      id
      note
      userSession {
        id
        owner {
          id
          email
        }
      }
      comments {
        id
        text
        owner {
          id
          email
        }
      }
    }
  }
`;

const QUERY_ANNOTATION_COMMENTS_VARIABLES = {
  id: 1,
};

describe('Comments (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupTestApplication();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Query Annotation Comments', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { errors } = await request(app.getHttpServer())
        .query(QUERY_ANNOTATION_COMMENTS)
        .variables(QUERY_ANNOTATION_COMMENTS_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Unauthorized');
    });

    it('Session Owner user should get list of all comments', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .query(QUERY_ANNOTATION_COMMENTS)
        .variables(QUERY_ANNOTATION_COMMENTS_VARIABLES)
        .expectNoErrors();

      expect(data).toMatchSnapshot();
    });

    it('Annotation Owner user should get list of all comments', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .query(QUERY_ANNOTATION_COMMENTS)
        .variables(QUERY_ANNOTATION_COMMENTS_VARIABLES)
        .expectNoErrors();

      expect(data).toMatchSnapshot();
    });

    it('Authenticated user who is not a session owner or not the annotation owner should not get an answer', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner2.id}`, { type: 'bearer' })
        .query(QUERY_ANNOTATION_COMMENTS)
        .variables(QUERY_ANNOTATION_COMMENTS_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden');
    });

    it('Authenticated user who is participant in the session but not the annotation owner should not get an answer', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant2.id}`, { type: 'bearer' })
        .query(QUERY_ANNOTATION_COMMENTS)
        .variables(QUERY_ANNOTATION_COMMENTS_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden');
    });
  });
});
