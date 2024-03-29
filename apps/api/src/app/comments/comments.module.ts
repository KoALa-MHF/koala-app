import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { AnnotationsModule } from '../annotations/annotations.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comment,
    ]),
    AnnotationsModule,
    UsersModule,
  ],
  providers: [
    CommentsResolver,
    CommentsService,
  ],
  exports: [
    CommentsService,
  ],
})
export class CommentsModule {}
