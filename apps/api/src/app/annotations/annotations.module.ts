import { Module } from '@nestjs/common';
import { AnnotationsService } from './annotations.service';
import { AnnotationsResolver } from './annotations.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Annotation } from './entities/annotation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Annotation])],
  providers: [AnnotationsResolver, AnnotationsService],
})
export class AnnotationsModule {}
