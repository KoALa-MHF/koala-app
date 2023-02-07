import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MarkerEntity } from '../../types/marker-entity';

@Component({
  selector: 'koala-marker-preview',
  templateUrl: './marker-preview.component.html',
  styleUrls: [
    './marker-preview.component.scss',
    '../../session-common.scss',
  ],
})
export class MarkerPreviewComponent {
  @Input() marker!: MarkerEntity;
  @Input() createEnabled = false;

  @Output() resetMarkerData = new EventEmitter();
  @Output() markerAdd = new EventEmitter();

  public onReset() {
    this.resetMarkerData.emit();
  }

  public onAddMarker() {
    this.markerAdd.emit();
  }
}
