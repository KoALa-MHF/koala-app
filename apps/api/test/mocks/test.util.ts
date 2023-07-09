import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { AppModule } from '../../src/app/app.module';
import { setupApplication } from '../../src/bootstrap';
import { AuthGuardMock } from './guards/AuthGuard.mock';
import { AuthGuard } from '../../src/app/core/guards/auth.guard';
import { SeedModule } from '../../src/app/seed/seed.module';
import { SeedService } from '../../src/app/seed/seed.service';
import { JwtService } from '@nestjs/jwt';
import { JwtServiceMock } from './services/JwtService.mock';

export async function setupTestApplication(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      SeedModule,
      AppModule,
    ],
  })
    .overrideGuard(AuthGuard)
    .useValue(new AuthGuardMock())
    .overrideProvider(JwtService)
    .useValue(new JwtServiceMock())
    .compile();

  const app: INestApplication = moduleFixture.createNestApplication();
  setupApplication(app);
  await app.init();
  const seeder = app.get(SeedService);
  await seeder.seed();

  return app;
}
