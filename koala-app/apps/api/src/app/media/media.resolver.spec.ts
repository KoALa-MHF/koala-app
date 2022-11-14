import { Test, TestingModule } from '@nestjs/testing';
import { MediaResolver } from './media.resolver';
import { MediaService } from './media.service';

describe('MediaResolver', () => {
  let resolver: MediaResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaResolver, MediaService],
    }).compile();

    resolver = module.get<MediaResolver>(MediaResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
