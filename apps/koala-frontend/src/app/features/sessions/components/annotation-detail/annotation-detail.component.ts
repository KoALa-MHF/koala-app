import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataPoint } from '../annotation/annotation.component';
import { AnnotationTextComment } from '../annotation-text-comment/annotation-text-comment.component';

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
  @Output() saveAudioComment = new EventEmitter<AnnotationTextComment>();

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

  onAudioCommentSave() {
    this.saveAudioComment.emit();
  }
}
