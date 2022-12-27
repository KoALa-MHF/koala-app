import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MarkerEntity } from '../../types/marker-preview';

@Component({
  selector: 'koala-session-marker-data',
  templateUrl: './session-marker-data.component.html',
  styleUrls: [
    './session-marker-data.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionMarkerDataComponent implements OnInit {
  @Input() markerDataForm!: FormGroup;
  @Input() markerData!: any;
  @Input() markers!: MarkerEntity[];
  @Input() previewMarker!: MarkerEntity;

  @Output() resetMarkerData = new EventEmitter();
  @Output() markerAdd = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  public onReset() {
    this.resetMarkerData.emit();
  }

  public onAddMarker() {
    this.markerAdd.emit();
  }
}
