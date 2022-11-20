import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnnotationsService } from './annotations.service';
import { Annotation } from './entities/annotation.entity';
import { CreateAnnotationInput } from './dto/create-annotation.input';
import { UpdateAnnotationInput } from './dto/update-annotation.input';

@Resolver(() => Annotation)
export class AnnotationsResolver {
  constructor(private readonly annotationsService: AnnotationsService) {}

  @Mutation(() => Annotation)
  createAnnotation(
    @Args('createAnnotationInput') createAnnotationInput: CreateAnnotationInput
  ) {
    return this.annotationsService.create(createAnnotationInput);
  }

  @Query(() => [Annotation], { name: 'annotations' })
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
    return this.annotationsService.update(
      id,
      updateAnnotationInput
    );
  }

  @Mutation(() => Annotation)
  removeAnnotation(@Args('id', { type: () => Int }) id: number) {
    return this.annotationsService.remove(id);
  }
}
