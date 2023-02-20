import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { AnnotationsService } from './annotations.service';
import { Annotation } from './entities/annotation.entity';
import { CreateAnnotationInput } from './dto/create-annotation.input';
import { UpdateAnnotationInput } from './dto/update-annotation.input';
import { MarkersService } from '../markers/markers.service';
import { UserSessionsService } from '../user-sessions/user-sessions.service';
import { forwardRef, Inject } from '@nestjs/common';

@Resolver(() => Annotation)
export class AnnotationsResolver {
  constructor(
    private readonly annotationsService: AnnotationsService,
    private readonly markersService: MarkersService,
    @Inject(forwardRef(() => UserSessionsService))
    private readonly userSessionsService: UserSessionsService
  ) {}

  @Mutation(() => Annotation)
  createAnnotation(@Args('createAnnotationInput') createAnnotationInput: CreateAnnotationInput) {
    return this.annotationsService.create(createAnnotationInput);
  }

  @Query(
    () => [
      Annotation,
    ],
    { name: 'annotations' }
  )
  findAll() {
    return this.annotationsService.findAll();
  }

  @Query(() => Annotation, { name: 'annotation' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.annotationsService.findOne(id);
  }

  @Mutation(() => Annotation)
  updateAnnotation(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateAnnotationInput') updateAnnotationInput: UpdateAnnotationInput
  ) {
    return this.annotationsService.update(id, updateAnnotationInput);
  }

  @Mutation(() => Annotation)
  removeAnnotation(@Args('id', { type: () => Int }) id: number) {
    return this.annotationsService.remove(id);
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
}
