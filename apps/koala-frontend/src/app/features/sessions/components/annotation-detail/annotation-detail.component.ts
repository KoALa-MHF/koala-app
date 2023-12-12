import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DataPoint } from '../annotation/annotation.component';
import {
  AnnotationAudioComment,
  AnnotationAudioCommentComponent,
} from '../annotation-audio-comment/annotation-audio-comment.component';
import {
  AnnotationTextCommentListComponent,
  CreateAnnotationTextComment,
} from '../annotation-text-comment-list/annotation-text-comment-list.component';
import { Comment } from '../../types/comment.entity';

@Component({
  selector: 'koala-annotation-detail',
  templateUrl: './annotation-detail.component.html',
  styleUrls: [
    './annotation-detail.component.css',
  ],
})
export class AnnotationDetailComponent {
  @Input() set annotation(value: DataPoint | null) {
    if (value) {
      this._annotation = value;
      if (this._annotation.note) {
        //this.note = { id: value.id, note: this._annotation.note };
      } else {
        //this.note = { id: value.id, note: '' };
      }
    }
  }

  get annotation(): DataPoint | null {
    return this._annotation;
  }

  private _annotation!: DataPoint | null;

  @Output() createTextComment = new EventEmitter<CreateAnnotationTextComment>();
  @Output() updateTextComment = new EventEmitter<Comment>();
  @Output() removeTextComment = new EventEmitter<number>();
  @Output() saveAudioComment = new EventEmitter<AnnotationAudioComment>();
  @Output() deleteAudioComment = new EventEmitter<number>();

  @ViewChild('textComment') textCommentListComponent!: AnnotationTextCommentListComponent;
  @ViewChild('audioComment') audioCommentComponent!: AnnotationAudioCommentComponent;

  onTextCommentCreate(commentText: string) {
    this.createTextComment.emit({ annotationId: this._annotation?.id || 0, text: commentText });
  }

  onTextCommentUpdate(comment: Comment) {
    this.updateTextComment.emit(comment);
  }

  onTextCommentDelete(commentId: number) {
    this.removeTextComment.emit(commentId);
  }

  onAudioCommentSave(audioComment: AnnotationAudioComment) {
    this.saveAudioComment.emit(audioComment);
  }

  onAudioCommentDelete() {
    this.deleteAudioComment.emit(this.annotation?.id || 0);
  }

  resetComment() {
    this.textCommentListComponent.reset();
    this.audioCommentComponent.reset();
  }
}
