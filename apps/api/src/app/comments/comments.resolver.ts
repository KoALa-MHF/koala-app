import { Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

@Resolver(() => Comment)
@UseGuards(AuthGuard)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}
}
