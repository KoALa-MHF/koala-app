import request from 'supertest-graphql';
import gql from 'graphql-tag';
import { INestApplication } from '@nestjs/common';
import { setupTestApplication } from './mocks/test.util';
import { UsersData } from '../src/app/seed/data/users.data';
import { MarkerType } from '../src/app/markers/entities/marker.entity';

const QUERY_MARKERS = gql`
  query Markers {
    markers {
      id
      name
      description
      type
      color
      icon
    }
  }
`;

const CREATE_MARKER = gql`
  mutation CreateMarker($createMarkerInput: CreateMarkerInput!) {
    createMarker(createMarkerInput: $createMarkerInput) {
      id
      name
      description
      type
      color
      icon
    }
  }
`;

const UPDATE_MARKER = gql`
  mutation UpdateMarker($id: Int!, $updateMarkerInput: UpdateMarkerInput!) {
    updateMarker(id: $id, updateMarkerInput: $updateMarkerInput) {
      id
      name
      description
      type
      color
      icon
    }
  }
`;

const REMOVE_MARKER = gql`
  mutation RemoveMarker($id: Int!) {
    removeMarker(id: $id) {
      id
      name
      description
      type
      color
      icon
    }
  }
`;

const CREATE_MARKER_VARIABLES = {
  createMarkerInput: {
    name: 'Event Marker',
    description: 'Event Marker Description',
    type: 'EVENT',
    color: '#000000',
    icon: 'icon1',
  },
};

const UPDATE_MARKER_VARIABLES = {
  id: 1,
  updateMarkerInput: {
    name: 'Event Marker Updated',
    description: 'Event Marker Description Updated',
    type: 'EVENT',
    color: '#FFFFFF',
    icon: 'icon2',
  },
};

const REMOVE_MARKER_VARIABLES = {
  id: 2,
};

describe('Markers (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await setupTestApplication();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Query Markers', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { errors } = await request(app.getHttpServer()).query(QUERY_MARKERS);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Unauthorized');
    });

    it('Session owner should get list of all markers, even of markers of other owners', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .query(QUERY_MARKERS)
        .expectNoErrors();

      expect(data).toMatchSnapshot();
    });

    it('Participating user should get list of all markers', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .query(QUERY_MARKERS)
        .expectNoErrors();

      expect(data).toMatchSnapshot();
    });
  });

  describe('Create Markers', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { errors } = await request(app.getHttpServer()).mutate(CREATE_MARKER).variables(CREATE_MARKER_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Unauthorized');
    });

    it('SAML Authenticated user can create a new marker', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(CREATE_MARKER)
        .variables(CREATE_MARKER_VARIABLES)
        .expectNoErrors();

      expect(data).toMatchSnapshot();
    });

    it('None SAML Authenticated user cannot create a new marker', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .mutate(CREATE_MARKER)
        .variables(CREATE_MARKER_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden resource');
    });
  });

  describe('Update Marker', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { errors } = await request(app.getHttpServer()).mutate(UPDATE_MARKER).variables(UPDATE_MARKER_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Unauthorized');
    });

    it('Marker Owner can update a marker', async () => {
      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(UPDATE_MARKER)
        .variables(UPDATE_MARKER_VARIABLES)
        .expectNoErrors();

      expect(data).toMatchSnapshot();
    });

    it('Marker Owner of another marker cannot update a marker and should get "Not Found" error', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner2.id}`, { type: 'bearer' })
        .mutate(UPDATE_MARKER)
        .variables(UPDATE_MARKER_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Not Found');
    });

    it('Participant (None SAML Authenticated user) cannot update a marker and should get "Forbidden resource" error', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .mutate(UPDATE_MARKER)
        .variables(UPDATE_MARKER_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden resource');
    });
  });

  describe('Remove Marker', () => {
    it('Not authenticated user should get "Unauthorized" error', async () => {
      const { errors } = await request(app.getHttpServer()).mutate(REMOVE_MARKER).variables(REMOVE_MARKER_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Unauthorized');
    });

    it('Marker Owner can remove a marker', async () => {
      const { data: sessionsBeforeDelete } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .query(QUERY_MARKERS)
        .expectNoErrors();
      expect(sessionsBeforeDelete).toMatchSnapshot();

      const { data } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .mutate(REMOVE_MARKER)
        .variables(REMOVE_MARKER_VARIABLES)
        .expectNoErrors();
      expect(data).toMatchSnapshot();

      const { data: sessionsAfterDelete } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner1.id}`, { type: 'bearer' })
        .query(QUERY_MARKERS)
        .expectNoErrors();
      expect(sessionsAfterDelete).toMatchSnapshot();
    });

    it('Marker Owner of another marker cannot remove the marker and should get "Not Found" error', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionOwner2.id}`, { type: 'bearer' })
        .mutate(REMOVE_MARKER)
        .variables(REMOVE_MARKER_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Not Found');
    });

    it('Participant (None SAML Authenticated user) cannot remove a session and should get "Forbidden resource" error', async () => {
      const { errors } = await request(app.getHttpServer())
        .auth(`${UsersData.sessionParticipant1.id}`, { type: 'bearer' })
        .mutate(REMOVE_MARKER)
        .variables(REMOVE_MARKER_VARIABLES);

      expect(errors).toHaveLength(1);
      expect(errors[0].message).toBe('Forbidden resource');
    });
  });
});
