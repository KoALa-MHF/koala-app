import { Args, Int, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { CurrentUser } from '../core/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { AnnotationsService } from '../annotations/annotations.service';
import { UpdateCommentInput } from './dto/update-comment.input';

@Resolver(() => Comment)
@UseGuards(AuthGuard)
export class CommentsResolver {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly annotationsService: AnnotationsService
  ) {}

  @Mutation(() => Comment)
  createComment(@Args('createCommentInput') createCommentInput: CreateCommentInput, @CurrentUser() user: User) {
    return this.commentsService.create(createCommentInput, user);
  }

  @Mutation(() => Comment)
  removeComment(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: User) {
    return this.commentsService.remove(id, user);
  }

  @Mutation(() => Comment)
  updateComment(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @CurrentUser() user: User
  ) {
    return this.commentsService.update(id, updateCommentInput, user);
  }

  @ResolveField()
  annotation(@Parent() comment: Comment) {
    const { annotationId } = comment;
    return this.annotationsService.findOne(annotationId);
  }

  @ResolveField()
  owner(@Parent() comment: Comment) {
    const { ownerId } = comment;
    return this.commentsService.findOne(ownerId);
  }
}
