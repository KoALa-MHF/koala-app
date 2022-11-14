import { Test, TestingModule } from '@nestjs/testing';
import { MarkersResolver } from './markers.resolver';
import { MarkersService } from './markers.service';

describe('MarkersResolver', () => {
  let resolver: MarkersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarkersResolver, MarkersService],
    }).compile();

    resolver = module.get<MarkersResolver>(MarkersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
