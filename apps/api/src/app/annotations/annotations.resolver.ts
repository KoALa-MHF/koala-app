import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { AnnotationsService } from './annotations.service';
import { Annotation } from './entities/annotation.entity';
import { CreateAnnotationInput } from './dto/create-annotation.input';
import { UpdateAnnotationInput } from './dto/update-annotation.input';
import { MarkersService } from '../markers/markers.service';
import { UserSessionsService } from '../user-sessions/user-sessions.service';
import { forwardRef, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../core/guards/auth.guard';
import { CurrentUser } from '../core/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { MediaService } from '../media/media.service';
import { Comment } from '../comments/entities/comment.entity';

@Resolver(() => Annotation)
@UseGuards(AuthGuard)
export class AnnotationsResolver {
  constructor(
    private readonly annotationsService: AnnotationsService,
    private readonly markersService: MarkersService,
    @Inject(forwardRef(() => UserSessionsService))
    private readonly userSessionsService: UserSessionsService,
    private readonly mediaService: MediaService
  ) {}

  @Mutation(() => Annotation)
  createAnnotation(
    @Args('createAnnotationInput') createAnnotationInput: CreateAnnotationInput,
    @CurrentUser() user: User
  ) {
    return this.annotationsService.create(createAnnotationInput, user);
  }

  @Query(() => Annotation, { name: 'annotation' })
  findOne(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: User) {
    return this.annotationsService.findOne(id, user, true);
  }

  @Mutation(() => Annotation)
  updateAnnotation(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateAnnotationInput') updateAnnotationInput: UpdateAnnotationInput,
    @CurrentUser() user: User
  ) {
    return this.annotationsService.update(id, updateAnnotationInput, user);
  }

  @Mutation(() => Annotation)
  removeAnnotationMedia(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: User) {
    return this.annotationsService.removeMedia(id, user);
  }

  @Mutation(() => Annotation)
  removeAnnotation(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: User) {
    return this.annotationsService.remove(id, user);
  }

  @ResolveField()
  userSession(@Parent() annotation: Annotation) {
    const { userSessionId } = annotation;
    return this.userSessionsService.findOne(userSessionId);
  }

  @ResolveField()
  marker(@Parent() annotation: Annotation) {
    const { markerId } = annotation;
    return this.markersService.findOne(markerId);
  }

  @ResolveField()
  media(@Parent() annotation: Annotation) {
    const { mediaId } = annotation;
    if (mediaId === null) {
      return null;
    } else {
      return this.mediaService.findOne(mediaId);
    }
  }

  @ResolveField(() => [
    Comment,
  ])
  comments(@Parent() annotation: Annotation, @CurrentUser() user: User) {
    console.log('comments', user);
    return this.annotationsService.findAllCommments(annotation.id, user);
  }
}
