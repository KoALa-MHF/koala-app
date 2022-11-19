import { Test, TestingModule } from '@nestjs/testing';
import { AnnotationsResolver } from './annotations.resolver';
import { AnnotationsService } from './annotations.service';

describe('AnnotationsResolver', () => {
  let resolver: AnnotationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnnotationsResolver, AnnotationsService],
    }).compile();

    resolver = module.get<AnnotationsResolver>(AnnotationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
