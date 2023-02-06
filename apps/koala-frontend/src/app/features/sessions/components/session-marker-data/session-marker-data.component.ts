import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MarkerEntity } from '../../types/marker-entity';

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
  @Input() markers!: MarkerEntity[];
  @Input() previewMarker!: MarkerEntity;

  @Output() resetMarkerData = new EventEmitter();
  @Output() markerAdd = new EventEmitter();
  @Output() markerSortChange = new EventEmitter<MarkerEntity[]>();

  public onReset() {
    this.resetMarkerData.emit();
  }

  public onAddMarker() {
    this.markerAdd.emit();
  }

  public onSortChange(markers: MarkerEntity[]) {
    this.markerSortChange.emit(markers);
  }
}
