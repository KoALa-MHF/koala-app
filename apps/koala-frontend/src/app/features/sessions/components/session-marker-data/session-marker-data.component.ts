import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Marker } from '../../types/marker.entity';

@Component({
  selector: 'koala-session-marker-data',
  templateUrl: './session-marker-data.component.html',
  styleUrls: [
    './session-marker-data.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionMarkerDataComponent {
  @Input() markerDataForm!: FormGroup;
  @Input() markerData!: any;
  @Input() markers!: Marker[];
  @Input() previewMarker!: Marker;

  @Output() resetMarkerData = new EventEmitter();
  @Output() markerAdd = new EventEmitter();
  @Output() multiMarkerAdd = new EventEmitter();
  @Output() markerSortChange = new EventEmitter<Marker[]>();

  public onReset() {
    this.resetMarkerData.emit();
  }

  public onAddMarker() {
    this.markerAdd.emit();
  }

  public onAddMultipleMarkers(markers: Marker[]) {
    this.multiMarkerAdd.emit(markers);
  }

  public onSortChange(markers: Marker[]) {
    this.markerSortChange.emit(markers);
  }
}
