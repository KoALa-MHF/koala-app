import { NestFactory } from '@nestjs/core';
import { SeedModule } from './app/seed/seed.module';
import { SeedService } from './app/seed/seed.service';

async function bootstrap() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Seeding database is only allowed for development');
  }
  const appContext = await NestFactory.createApplicationContext(SeedModule);
  try {
    const seeder = appContext.get(SeedService);
    await seeder.seed();
  } catch (error) {
    console.log('Seeding database failed', error);
  } finally {
    await appContext.close();
  }
}

bootstrap();
