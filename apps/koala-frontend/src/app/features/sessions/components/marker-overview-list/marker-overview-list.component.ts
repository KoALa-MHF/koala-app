import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Marker } from '../../types/marker.entity';

@Component({
  selector: 'koala-marker-overview-list',
  templateUrl: './marker-overview-list.component.html',
  styleUrls: [
    './marker-overview-list.component.scss',
  ],
})
export class MarkerOverviewListComponent {
  @Input() markers!: Marker[];
  @Output() markerAdd = new EventEmitter<Marker[]>();

  selectedMarkers: Marker[] = [];

  addMarker() {
    this.markerAdd.emit(this.selectedMarkers);
    this.selectedMarkers = [];
  }
}
