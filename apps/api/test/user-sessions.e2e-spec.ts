import request, { LEGACY_WEBSOCKET_PROTOCOL, supertestWs } from 'supertest-graphql';
import gql from 'graphql-tag';
import { INestApplication } from '@nestjs/common';
import { setupTestApplication } from './mocks/test.util';
import { UsersData } from '../src/app/seed/data/users.data';

const QUERY_USER_SESSIONS = gql`
  query UserSessions {
    userSessions {
      id
      status
      note
      owner {
        id
        email
      }
      session {
        id
        name
      }
      annotations {
        id
        start
        end
      }
    }
  }
`;

const QUERY_USER_SESSION = gql`
  query UserSession($id: Int!) {
    userSession(id: $id) {
      id
      status
      note
      session {
        id
        name
      }
      annotations {
        id
        start
        end
        userSession {
          id
          status
        }
      }
    }
  }
`;

const UPDATE_USER_SESSION = gql`
  mutation UpdateUserSession($id: Int!, $updateUserSessionInput: UpdateUserSessionInput!) {
    updateUserSession(id: $id, updateUserSessionInput: $updateUserSessionInput) {
      id
      status
      note
      owner {
        id
        email
      }
      session {
        id
        name
        toolbars {
          id
        }
      }
      annotations {
        id
        marker {
          id
        }
      }
    }
  }
`;

const REMOVE_USER_SESSION = gql`
  mutation RemoveUserSession($id: Int!) {
    removeUserSession(id: $id) {
      id
    }
  }
`;

const QUERY_USER_SESSION_VARIABLES = {
  id: 5,
};

const UPDATE_USER_SESSION_VARIABLES = {
  id: 5,
  updateUserSessionInput: {
    note: 'Update Notes',
  },
};

const REMOVE_USER_SESSION_VARIABLES = {
  id: 5,
};

describe('User Sessions (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupTestApplication();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Query User Sessions', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { errors } = await request(app.getHttpServer()).query(QUERY_USER_SESSIONS);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Unauthorized');
    });

    it('Authenticated user should get list of all owned user sessions', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant2.id}`, { type: 'bearer' })
        .query(QUERY_USER_SESSIONS)
        .expectNoErrors();

      expect(data).toMatchSnapshot();
    });
  });

  describe('Query User Session', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { errors } = await request(app.getHttpServer())
        .query(QUERY_USER_SESSION)
        .variables(QUERY_USER_SESSION_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Unauthorized');
    });

    it('Authenticated user should get own user session', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant2.id}`, { type: 'bearer' })
        .query(QUERY_USER_SESSION)
        .variables(QUERY_USER_SESSION_VARIABLES)
        .expectNoErrors();

      expect(data).toMatchSnapshot();
    });

    it('Authenticated user must not get the user session of another user', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .query(QUERY_USER_SESSION)
        .variables(QUERY_USER_SESSION_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden');
    });
  });

  describe('Update User Session', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { errors } = await request(app.getHttpServer())
        .mutate(UPDATE_USER_SESSION)
        .variables(UPDATE_USER_SESSION_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Unauthorized');
    });

    it('Authenticated user can update own user session', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant2.id}`, { type: 'bearer' })
        .mutate(UPDATE_USER_SESSION)
        .variables(UPDATE_USER_SESSION_VARIABLES)
        .expectNoErrors();

      expect(data).toMatchSnapshot();
    });

    it('Authenticated user can only update the right fields', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant2.id}`, { type: 'bearer' })
        .mutate(UPDATE_USER_SESSION)
        .variables({
          ...UPDATE_USER_SESSION_VARIABLES,
          owner: {
            email: 'user_can_not_be_updated@koala-app.de',
          },
          sessionId: 10,
        })
        .expectNoErrors();

      expect(data).toMatchSnapshot();
    });

    it('Authenticated user cannot update user session of another user', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .mutate(UPDATE_USER_SESSION)
        .variables(UPDATE_USER_SESSION_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden');
    });
  });

  describe('Remove User Session', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { errors } = await request(app.getHttpServer())
        .mutate(REMOVE_USER_SESSION)
        .variables(REMOVE_USER_SESSION_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Unauthorized');
    });

    it('Authenticated user can remove own user session', async () => {
      const { data: userSessionsBeforeRemove } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant2.id}`, { type: 'bearer' })
        .query(QUERY_USER_SESSIONS)
        .expectNoErrors();

      expect(userSessionsBeforeRemove).toMatchSnapshot();

      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant2.id}`, { type: 'bearer' })
        .mutate(REMOVE_USER_SESSION)
        .variables(REMOVE_USER_SESSION_VARIABLES)
        .expectNoErrors();

      expect(data).toMatchSnapshot();

      const { data: userSessionsAfterRemove } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant2.id}`, { type: 'bearer' })
        .query(QUERY_USER_SESSIONS)
        .expectNoErrors();

      expect(userSessionsAfterRemove).toMatchSnapshot();
    });

    it('Authenticated user cannot remove a user session of another user', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .mutate(REMOVE_USER_SESSION)
        .variables(REMOVE_USER_SESSION_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden');
    });
  });
});
