import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Marker } from '../../types/marker.entity';

@Component({
  selector: 'koala-session-marker-preview',
  templateUrl: './session-marker-preview.component.html',
  styleUrls: [
    './session-marker-preview.component.css',
  ],
})
export class SessionMarkerPreviewComponent {
  @Input() marker!: Marker;
  @Input() createEnabled = false;

  @Output() resetMarkerData = new EventEmitter();
  @Output() markerAdd = new EventEmitter();

  onAddMarker() {
    this.markerAdd.emit();
  }

  onReset() {
    this.resetMarkerData.emit();
  }
}
