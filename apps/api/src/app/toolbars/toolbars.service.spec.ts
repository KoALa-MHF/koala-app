import { Test, TestingModule } from '@nestjs/testing';
import { ToolbarsService } from './toolbars.service';

describe('ToolbarsService', () => {
  let service: ToolbarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToolbarsService,
      ],
    }).compile();

    service = module.get<ToolbarsService>(ToolbarsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
