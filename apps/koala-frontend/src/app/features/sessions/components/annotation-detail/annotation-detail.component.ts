import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DataPoint } from '../annotation/annotation.component';
import {
  AnnotationTextComment,
  AnnotationTextCommentComponent,
} from '../annotation-text-comment/annotation-text-comment.component';
import {
  AnnotationAudioComment,
  AnnotationAudioCommentComponent,
} from '../annotation-audio-comment/annotation-audio-comment.component';

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
        this.note = { id: value.id, note: this._annotation.note };
      } else {
        this.note = { id: value.id, note: '' };
      }
    }
  }

  get annotation(): DataPoint | null {
    return this._annotation;
  }

  private _annotation!: DataPoint | null;

  @Output() saveTextComment = new EventEmitter<AnnotationTextComment>();
  @Output() saveAudioComment = new EventEmitter<AnnotationAudioComment>();
  @Output() deleteAudioComment = new EventEmitter<number>();

  @ViewChild('textComment') textCommentComponent!: AnnotationTextCommentComponent;
  @ViewChild('audioComment') audioCommentComponent!: AnnotationAudioCommentComponent;

  note: AnnotationTextComment = {
    id: 0,
    note: '',
  };

  onTextCommentSave(note: string) {
    this.saveTextComment.emit({ id: this.annotation?.id || 0, note: note });
  }

  onTextCommentDelete() {
    this.saveTextComment.emit({ id: this.annotation?.id || 0, note: '' });
  }

  onAudioCommentSave(audioComment: AnnotationAudioComment) {
    this.saveAudioComment.emit(audioComment);
  }

  onAudioCommentDelete() {
    this.deleteAudioComment.emit(this.annotation?.id || 0);
  }

  resetComment() {
    this.textCommentComponent.reset();
    this.audioCommentComponent.reset();
  }
}
