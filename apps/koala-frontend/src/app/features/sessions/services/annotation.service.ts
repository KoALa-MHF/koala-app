import { Injectable } from '@angular/core';
import {
  CreateAnnotationGQL,
  CreateAnnotationInput,
  DeleteAnnotationGQL,
  UpdateAnnotationNoteGQL,
} from '../../../graphql/generated/graphql';

@Injectable()
export class AnnotationService {
  constructor(
    private readonly createAnnotationGQL: CreateAnnotationGQL,
    private readonly deleteAnnotationGQL: DeleteAnnotationGQL,
    private readonly updateAnnotationNoteGQL: UpdateAnnotationNoteGQL
  ) {}

  create(annotation: CreateAnnotationInput) {
    return this.createAnnotationGQL.mutate({ createAnnotation: annotation });
  }

  remove(id: number) {
    return this.deleteAnnotationGQL.mutate({ id });
  }

  updateNote(id: number, note: string) {
    return this.updateAnnotationNoteGQL.mutate({ id, note });
  }
}
