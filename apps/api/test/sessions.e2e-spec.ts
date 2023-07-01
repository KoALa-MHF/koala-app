import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app/app.module';
import { GraphQLValidationPipe } from '../src/app/core/pipes/graphql-validation.pipe';
import request from 'supertest-graphql';
import gql from 'graphql-tag';

describe('Sessions (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new GraphQLValidationPipe());
    await app.init();
  });

  it('Not authenticated user should get Unauthorized', async () => {
    const { errors } = await request(app.getHttpServer()).query(gql`
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
    `);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe('Unauthorized');
  });
});
