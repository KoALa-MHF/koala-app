import { Test, TestingModule } from '@nestjs/testing';
import { ToolbarsResolver } from './toolbars.resolver';
import { ToolbarsService } from './toolbars.service';

describe('ToolbarsResolver', () => {
  let resolver: ToolbarsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToolbarsResolver,
        ToolbarsService,
      ],
    }).compile();

    resolver = module.get<ToolbarsResolver>(ToolbarsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
