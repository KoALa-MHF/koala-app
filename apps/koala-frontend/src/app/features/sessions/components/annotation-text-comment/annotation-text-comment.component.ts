import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DisplayMode } from '../../types/display-mode.enum';

@Component({
  selector: 'koala-annotation-text-comment',
  templateUrl: './annotation-text-comment.component.html',
  styleUrls: [
    './annotation-text-comment.component.css',
  ],
})
export class AnnotationTextCommentComponent {
  @Input() note = '';
  @Input() displayMode = DisplayMode.DISPLAY;

  @Output() edit = new EventEmitter();
  @Output() save = new EventEmitter();
  @Output() cancel = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() noteChange = new EventEmitter<string>();

  DisplayMode = DisplayMode;

  onAnnotationDetailCancel() {
    this.cancel.emit();
  }

  onAnnotationDetailSave() {
    this.save.emit();
  }

  onAnnotationDetailDelete() {
    this.delete.emit();
  }

  onAnnotationDetailEdit() {
    this.edit.emit();
  }

  onNoteChange(event: any) {
    this.noteChange.emit(event.target.value);
  }
}
