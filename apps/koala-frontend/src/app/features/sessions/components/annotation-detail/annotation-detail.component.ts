import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataPoint } from '../annotation/annotation.component';

export interface AnnotationDetail {
  id: number;
  note: string;
}

enum Mode {
  EDIT = 'Edit',
  DISPLAY = 'Display',
}

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
        this.mode = Mode.DISPLAY;
      } else {
        this.mode = Mode.EDIT;
      }
    }
  }

  get annotation(): DataPoint | null {
    return this._annotation;
  }

  private _annotation!: DataPoint | null;

  @Output() save = new EventEmitter<AnnotationDetail>();

  note = '';

  mode = Mode.EDIT;
  Mode = Mode;

  onAnnotationDetailCancel() {
    this.note = this.annotation?.note || '';
    this.mode = Mode.DISPLAY;
  }

  onAnnotationDetailSave() {
    this.save.emit({ id: this.annotation?.id || 0, note: this.note });
    this.mode = Mode.DISPLAY;
  }

  onAnnotationDetailDelete() {
    this.note = '';
    this.save.emit({ id: this.annotation?.id || 0, note: '' });
    this.mode = Mode.DISPLAY;
  }

  onAnnotationDetailEdit() {
    this.mode = Mode.EDIT;
  }

  onNoteChange(event: any) {
    this.note = event.target.value;
  }
}