import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app/app.module';
import { setupApplication } from '../../src/bootstrap';
import { SeedModule } from '../../src/app/seed/seed.module';
import { SeedService } from '../../src/app/seed/seed.service';
import { jest } from '@jest/globals';

// Mocking jsonwebtoken verify function, so that we can pass a none valid JWT token which represents the user ID
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn((token, secretOrPublicKey, options, callback) => {
    let done;

    if (callback) {
      done = callback;
    } else {
      done = function (err, data) {
        if (err) throw err;
        return data;
      };
    }

    const userId = token;
    return done(null, {
      sub: userId,
    });
  }),
}));

export async function setupTestApplication(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      SeedModule,
      AppModule,
    ],
  }).compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  setupApplication(app);
  await app.init();
  const seeder = app.get(SeedService);
  await seeder.seed();

  return app;
}
