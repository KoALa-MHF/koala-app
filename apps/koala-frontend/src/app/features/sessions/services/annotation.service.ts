import { Injectable } from '@angular/core';
import {
  CreateAnnotationCommentGQL,
  CreateAnnotationGQL,
  CreateAnnotationInput,
  DeleteAnnotationGQL,
  RemoveAnnotationAudioGQL,
  RemoveAnnotationCommentGQL,
  UpdateAnnotationAudioGQL,
  UpdateAnnotationCommentGQL,
  UpdateAnnotationNoteGQL,
} from '../../../graphql/generated/graphql';
import { Subject } from 'rxjs';

@Injectable()
export class AnnotationService {
  private selectedAnnotationId: number | undefined;
  private annotationSelectedSubject = new Subject<number>();
  public annotationSelected$ = this.annotationSelectedSubject.asObservable();

  constructor(
    private readonly createAnnotationGQL: CreateAnnotationGQL,
    private readonly deleteAnnotationGQL: DeleteAnnotationGQL,
    private readonly updateAnnotationNoteGQL: UpdateAnnotationNoteGQL,
    private readonly updateAnnotationAudioGQL: UpdateAnnotationAudioGQL,
    private readonly removeAnnotationAudioGQL: RemoveAnnotationAudioGQL,
    private readonly createAnnotationCommentGQL: CreateAnnotationCommentGQL,
    private readonly updateAnnotationCommentGQL: UpdateAnnotationCommentGQL,
    private readonly removeAnnotationCommentGQL: RemoveAnnotationCommentGQL
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

  updateMedia(id: number, mediaId: number) {
    return this.updateAnnotationAudioGQL.mutate({ id, mediaId });
  }

  removeMedia(id: number) {
    return this.removeAnnotationAudioGQL.mutate({ id });
  }

  createComment(id: number, text: string) {
    return this.createAnnotationCommentGQL.mutate({ annotationId: id, commentText: text });
  }

  updateComment(commentId: number, text: string) {
    return this.updateAnnotationCommentGQL.mutate({ commentId, commentText: text });
  }

  removeComment(commentId: number) {
    return this.removeAnnotationCommentGQL.mutate({ commentId });
  }

  setSelected(annotationId: number) {
    this.selectedAnnotationId = annotationId;
    this.annotationSelectedSubject.next(this.selectedAnnotationId);
  }
}
