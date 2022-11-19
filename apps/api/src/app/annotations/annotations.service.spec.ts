import { Test, TestingModule } from '@nestjs/testing';
import { AnnotationsService } from './annotations.service';

describe('AnnotationsService', () => {
  let service: AnnotationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnnotationsService],
    }).compile();

    service = module.get<AnnotationsService>(AnnotationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
