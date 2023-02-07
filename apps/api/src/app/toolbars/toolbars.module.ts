import { Module } from '@nestjs/common';
import { ToolbarsService } from './toolbars.service';
import { ToolbarsResolver } from './toolbars.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toolbar } from './entities/toolbar.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Toolbar,
    ]),
  ],
  providers: [
    ToolbarsResolver,
    ToolbarsService,
  ],
})
export class ToolbarsModule {}
