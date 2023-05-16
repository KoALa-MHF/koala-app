import { Injectable } from '@angular/core';
import { CreateAnnotationGQL, CreateAnnotationInput } from '../../../graphql/generated/graphql';

@Injectable()
export class AnnotationService {
  constructor(private readonly createAnnotationGQL: CreateAnnotationGQL) {}

  create(annotation: CreateAnnotationInput) {
    return this.createAnnotationGQL.mutate({ createAnnotation: annotation });
  }
}
