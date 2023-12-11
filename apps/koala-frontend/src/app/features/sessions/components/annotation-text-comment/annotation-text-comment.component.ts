import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisplayMode } from '../../types/display-mode.enum';
import { Comment } from '../../types/comment.entity';

@Component({
  selector: 'koala-annotation-text-comment',
  templateUrl: './annotation-text-comment.component.html',
  styleUrls: [
    './annotation-text-comment.component.css',
  ],
})
export class AnnotationTextCommentComponent {
  @Input() set comment(value: Comment) {
    this.originalNote = value.text;
    this._comment = value;
    if (this._comment.text) {
      this.displayMode = DisplayMode.DISPLAY;
    } else {
      this.displayMode = DisplayMode.EDIT;
    }
  }

  get comment() {
    return this._comment;
  }

  originalNote = '';
  _comment!: Comment;

  @Output() update = new EventEmitter<Comment>();
  @Output() delete = new EventEmitter<number>();

  displayMode = DisplayMode.DISPLAY;
  DisplayMode = DisplayMode;

  onCancel() {
    this._comment.text = this.originalNote;
    if (this._comment.text) {
      this.displayMode = DisplayMode.DISPLAY;
    } else {
      this.displayMode = DisplayMode.EDIT;
    }
  }

  onSave() {
    this.update.emit(this.comment);
    if (this._comment.text) {
      this.displayMode = DisplayMode.DISPLAY;
    } else {
      this.displayMode = DisplayMode.EDIT;
    }
  }

  onDelete() {
    this.delete.emit(this.comment.id);
  }

  onEdit() {
    this.displayMode = DisplayMode.EDIT;
  }

  onChange(event: any) {
    this._comment.text = event.target.value;
  }

  reset() {
    this.onCancel();
  }
}
