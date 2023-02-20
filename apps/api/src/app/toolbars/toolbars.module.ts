import { forwardRef, Module } from '@nestjs/common';
import { ToolbarsService } from './toolbars.service';
import { ToolbarsResolver } from './toolbars.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Toolbar } from './entities/toolbar.entity';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Toolbar,
    ]),
    forwardRef(() => SessionsModule),
  ],
  providers: [
    ToolbarsResolver,
    ToolbarsService,
  ],
  exports: [
    ToolbarsService,
  ],
})
export class ToolbarsModule {}
