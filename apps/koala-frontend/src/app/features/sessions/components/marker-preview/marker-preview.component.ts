import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'koala-marker-preview',
  templateUrl: './marker-preview.component.html',
  styleUrls: [
    './marker-preview.component.scss',
    '../../session-common.scss',
  ],
})
export class MarkerPreviewComponent implements OnInit {
  @Input() label: string = '';
  @Input() color: string = '';
  @Input() markerType: string = '';
  @Input() icon: string = '';

  @Input() createEnabled: boolean = false;
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
