import { forwardRef, Module } from '@nestjs/common';
import { AnnotationsService } from './annotations.service';
import { AnnotationsResolver } from './annotations.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Annotation } from './entities/annotation.entity';
import { MarkersModule } from '../markers/markers.module';
import { UserSessionsModule } from '../user-sessions/user-sessions.module';
import { MediaModule } from '../media/media.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Annotation,
    ]),
    MarkersModule,
    forwardRef(() => UserSessionsModule),
    MediaModule,
  ],
  providers: [
    AnnotationsResolver,
    AnnotationsService,
  ],
  exports: [
    AnnotationsService,
  ],
})
export class AnnotationsModule {}
