import { Injectable } from '@angular/core';
import { CreateAnnotationGQL, CreateAnnotationInput, GetMarkersGQL } from '../../../graphql/generated/graphql';

@Injectable()
export class AnnotationService {
  constructor(
    private readonly createAnnotationGQL: CreateAnnotationGQL,
    private readonly getMarkersGQL: GetMarkersGQL
  ) {}

  create(annotation: CreateAnnotationInput) {
    return this.createAnnotationGQL.mutate({ createAnnotation: annotation });
  }
}
