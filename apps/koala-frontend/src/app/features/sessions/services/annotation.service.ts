import { Injectable } from '@angular/core';
import { CreateAnnotationGQL, CreateAnnotationInput, DeleteAnnotationGQL } from '../../../graphql/generated/graphql';

@Injectable()
export class AnnotationService {
  constructor(
    private readonly createAnnotationGQL: CreateAnnotationGQL,
    private readonly deleteAnnotationGQL: DeleteAnnotationGQL
  ) {}

  create(annotation: CreateAnnotationInput) {
    return this.createAnnotationGQL.mutate({ createAnnotation: annotation });
  }

  remove(id: number) {
    return this.deleteAnnotationGQL.mutate({ id });
  }
}
