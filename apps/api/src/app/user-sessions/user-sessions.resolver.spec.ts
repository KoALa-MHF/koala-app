import { Test, TestingModule } from '@nestjs/testing';
import { UserSessionsResolver } from './user-sessions.resolver';
import { UserSessionsService } from './user-sessions.service';

describe('UserSessionsResolver', () => {
  let resolver: UserSessionsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSessionsResolver, UserSessionsService],
    }).compile();

    resolver = module.get<UserSessionsResolver>(UserSessionsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
