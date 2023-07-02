import request from 'supertest-graphql';
import gql from 'graphql-tag';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../src/app/app.module';
import { setupApplication } from '../src/bootstrap';
import { AuthGuardMock } from './mocks/guards/AuthGuard.mock';
import { AuthGuard } from '../src/app/core/guards/auth.guard';

const QUERY_SESSIONS = gql`
  query Sessions {
    sessions {
      id
      name
      description
      media {
        name
        mimeType
      }
      toolbars {
        id
        session {
          id
          name
        }
      }
      userSessions {
        id
        owner {
          email
        }
        session {
          id
          name
        }
      }
    }
  }
`;

describe('Sessions (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(new AuthGuardMock())
      .compile();

    app = moduleFixture.createNestApplication();
    setupApplication(app);
    await app.init();
  });

  it('Not authenticated user should get Unauthorized', async () => {
    const { errors } = await request(app.getHttpServer()).query(QUERY_SESSIONS);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe('Unauthorized');
  });

  it('Authenticated user should get Unauthorized', async () => {
    const { data } = await request(app.getHttpServer())
      .auth('12323423', { type: 'bearer' })
      .query(QUERY_SESSIONS)
      .expectNoErrors();

    console.log(data);
  });
});
