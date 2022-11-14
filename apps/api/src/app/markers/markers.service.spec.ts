import { Test, TestingModule } from '@nestjs/testing';
import { MarkersService } from './markers.service';

describe('MarkersService', () => {
  let service: MarkersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarkersService],
    }).compile();

    service = module.get<MarkersService>(MarkersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
