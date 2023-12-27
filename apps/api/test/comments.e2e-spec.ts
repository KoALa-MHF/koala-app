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

const CREATE_COMMENT = gql`
  mutation CreateComment($createCommentInput: CreateCommentInput!) {
    createComment(createCommentInput: $createCommentInput) {
      text
    }
  }
`;

const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: Int!, $updateCommentInput: UpdateCommentInput!) {
    updateComment(id: $id, updateCommentInput: $updateCommentInput) {
      text
    }
  }
`;

const REMOVE_COMMENT = gql`
  mutation RemoveComment($id: Int!) {
    removeComment(id: $id) {
      id
    }
  }
`;

const QUERY_ANNOTATION_COMMENTS_VARIABLES = {
  id: 1,
};

const CREATE_COMMENT_VARIABLES_SESSION_OWNER = {
  createCommentInput: {
    text: 'New comment from a session owner',
    annotationId: 1,
  },
};

const CREATE_COMMENT_VARIABLES_ANNOTATION_OWNER = {
  createCommentInput: {
    text: 'New comment from the annoation owner',
    annotationId: 1,
  },
};

const UPDATE_COMMENT_VARIABLES_SESSION_OWNER = {
  id: 2,
  updateCommentInput: {
    text: 'Updated comment session owner',
  },
};

const UPDATE_COMMENT_VARIABLES_ANNOTATION_OWNER = {
  id: 1,
  updateCommentInput: {
    text: 'Updated comment annotation owner',
  },
};

const REMOVE_COMMENT_VARIABLES_SESSION_OWNER = {
  id: 2,
};

const REMOVE_COMMENT_VARIABLES_ANNOTATION_OWNER = {
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

  describe('Create Comment', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { errors } = await request(app.getHttpServer())
        .mutate(CREATE_COMMENT)
        .variables(CREATE_COMMENT_VARIABLES_ANNOTATION_OWNER);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Unauthorized');
    });

    it('Session owner can create a new comment', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(CREATE_COMMENT)
        .variables(CREATE_COMMENT_VARIABLES_SESSION_OWNER)
        .expectNoErrors();

      const { data: dataQuery } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .query(QUERY_ANNOTATION_COMMENTS)
        .variables(QUERY_ANNOTATION_COMMENTS_VARIABLES)
        .expectNoErrors();

      expect(dataQuery).toMatchSnapshot();

      expect(data).toMatchSnapshot();
    });

    it('Annotation owner can create a new comment', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .mutate(CREATE_COMMENT)
        .variables(CREATE_COMMENT_VARIABLES_ANNOTATION_OWNER)
        .expectNoErrors();

      expect(data).toMatchSnapshot();

      const { data: dataQuery } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .query(QUERY_ANNOTATION_COMMENTS)
        .variables(QUERY_ANNOTATION_COMMENTS_VARIABLES)
        .expectNoErrors();

      expect(dataQuery).toMatchSnapshot();
    });

    it('Authenticated user who is participant in the session but not the annotation owner should not be allowed to create a comment', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant2.id}`, { type: 'bearer' })
        .mutate(CREATE_COMMENT)
        .variables(CREATE_COMMENT_VARIABLES_ANNOTATION_OWNER);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden');
    });
  });

  describe('Update Comment', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { errors } = await request(app.getHttpServer())
        .mutate(UPDATE_COMMENT)
        .variables(UPDATE_COMMENT_VARIABLES_SESSION_OWNER);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Unauthorized');
    });

    it('Session Owner can update its own comment', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(UPDATE_COMMENT)
        .variables(UPDATE_COMMENT_VARIABLES_SESSION_OWNER)
        .expectNoErrors();

      expect(data).toMatchSnapshot();
    });

    it('Annoation Owner can update its own comment', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .mutate(UPDATE_COMMENT)
        .variables(UPDATE_COMMENT_VARIABLES_ANNOTATION_OWNER)
        .expectNoErrors();

      expect(data).toMatchSnapshot();
    });

    it('Annoation Owner cannot update session owners comment', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .mutate(UPDATE_COMMENT)
        .variables(UPDATE_COMMENT_VARIABLES_SESSION_OWNER);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden');
    });

    it('Session Owner cannot update annotation owners comment', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(UPDATE_COMMENT)
        .variables(UPDATE_COMMENT_VARIABLES_ANNOTATION_OWNER);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden');
    });

    it('Authenticated user who is participant in the session but not the annotation owner should not be allowed to update a comment', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant2.id}`, { type: 'bearer' })
        .mutate(UPDATE_COMMENT)
        .variables(UPDATE_COMMENT_VARIABLES_ANNOTATION_OWNER);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden');
    });
  });

  describe('Remove Comment', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { errors } = await request(app.getHttpServer())
        .mutate(REMOVE_COMMENT)
        .variables(REMOVE_COMMENT_VARIABLES_ANNOTATION_OWNER);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Unauthorized');
    });

    it('Session Owner can remove own comment', async () => {
      const { data: sessionsBeforeDelete } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .query(QUERY_ANNOTATION_COMMENTS)
        .variables(QUERY_ANNOTATION_COMMENTS_VARIABLES)
        .expectNoErrors();
      expect(sessionsBeforeDelete).toMatchSnapshot();

      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(REMOVE_COMMENT)
        .variables(REMOVE_COMMENT_VARIABLES_SESSION_OWNER)
        .expectNoErrors();
      expect(data).toMatchSnapshot();

      const { data: sessionsAfterDelete } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .query(QUERY_ANNOTATION_COMMENTS)
        .variables(QUERY_ANNOTATION_COMMENTS_VARIABLES)
        .expectNoErrors();
      expect(sessionsAfterDelete).toMatchSnapshot();
    });

    it('Annotation Owner can remove own comment', async () => {
      const { data: sessionsBeforeDelete } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .query(QUERY_ANNOTATION_COMMENTS)
        .variables(QUERY_ANNOTATION_COMMENTS_VARIABLES)
        .expectNoErrors();
      expect(sessionsBeforeDelete).toMatchSnapshot();

      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .mutate(REMOVE_COMMENT)
        .variables(REMOVE_COMMENT_VARIABLES_ANNOTATION_OWNER)
        .expectNoErrors();
      expect(data).toMatchSnapshot();

      const { data: sessionsAfterDelete } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .query(QUERY_ANNOTATION_COMMENTS)
        .variables(QUERY_ANNOTATION_COMMENTS_VARIABLES)
        .expectNoErrors();
      expect(sessionsAfterDelete).toMatchSnapshot();
    });

    it('Session Owner cannot remove annotation owner comment', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(REMOVE_COMMENT)
        .variables(REMOVE_COMMENT_VARIABLES_ANNOTATION_OWNER);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden');
    });

    it('Annotation Owner cannot remove session owner comment', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .mutate(REMOVE_COMMENT)
        .variables(REMOVE_COMMENT_VARIABLES_SESSION_OWNER);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden');
    });

    it('Authenticated user who is participant in the session but not the annotation owner should not be allowed to remove a comment', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant2.id}`, { type: 'bearer' })
        .mutate(REMOVE_COMMENT)
        .variables(REMOVE_COMMENT_VARIABLES_ANNOTATION_OWNER);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden');
    });
  });
});
