import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataPoint } from '../annotation/annotation.component';
import { DisplayMode } from '../../types/display-mode.enum';

export interface AnnotationDetail {
  id: number;
  note: string;
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
        this.note = this._annotation.note;
        this.mode = DisplayMode.DISPLAY;
      } else {
        this.note = '';
        this.mode = DisplayMode.EDIT;
      }
    }
  }

  get annotation(): DataPoint | null {
    return this._annotation;
  }

  private _annotation!: DataPoint | null;

  @Output() save = new EventEmitter<AnnotationDetail>();

  note = '';

  mode = DisplayMode.EDIT;
  Mode = DisplayMode;

  onAnnotationDetailCancel() {
    this.note = this.annotation?.note || '';
    if (this.note) {
      this.mode = DisplayMode.DISPLAY;
    } else {
      this.mode = DisplayMode.EDIT;
    }
  }

  onAnnotationDetailSave() {
    this.save.emit({ id: this.annotation?.id || 0, note: this.note });
    this.mode = DisplayMode.DISPLAY;
  }

  onAnnotationDetailDelete() {
    this.note = '';
    this.save.emit({ id: this.annotation?.id || 0, note: '' });
    this.mode = DisplayMode.DISPLAY;
  }

  onAnnotationDetailEdit() {
    this.mode = DisplayMode.EDIT;
  }

  onNoteChange(note: string) {
    this.note = note;
  }
}
