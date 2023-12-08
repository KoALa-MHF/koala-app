import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisplayMode } from '../../types/display-mode.enum';

export interface AnnotationTextComment {
  id: number;
  note: string;
}

@Component({
  selector: 'koala-annotation-text-comment',
  templateUrl: './annotation-text-comment.component.html',
  styleUrls: [
    './annotation-text-comment.component.css',
  ],
})
export class AnnotationTextCommentComponent {
  @Input() set comment(value: AnnotationTextComment) {
    this.originalNote = value.note;
    this._note = value.note;
    if (this._note) {
      this.displayMode = DisplayMode.DISPLAY;
    } else {
      this.displayMode = DisplayMode.EDIT;
    }
  }

  get comment() {
    return { id: this._commentId, note: this._note };
  }

  originalNote = '';
  _note = '';
  _commentId = 0;

  @Output() save = new EventEmitter<string>();
  @Output() delete = new EventEmitter();

  displayMode = DisplayMode.DISPLAY;
  DisplayMode = DisplayMode;

  onCancel() {
    this._note = this.originalNote;
    if (this._note) {
      this.displayMode = DisplayMode.DISPLAY;
    } else {
      this.displayMode = DisplayMode.EDIT;
    }
  }

  onSave() {
    this.save.emit(this._note);
    if (this._note) {
      this.displayMode = DisplayMode.DISPLAY;
    } else {
      this.displayMode = DisplayMode.EDIT;
    }
  }

  onDelete() {
    this.delete.emit();
    this.displayMode = DisplayMode.EDIT;
  }

  onEdit() {
    this.displayMode = DisplayMode.EDIT;
  }

  onChange(event: any) {
    this._note = event.target.value;
  }

  reset() {
    this.onCancel();
  }
}
