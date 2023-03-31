import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MarkerService } from '../../services/marker.service';
import { Marker } from '../../types/marker.entity';

@Component({
  selector: 'koala-marker-overview-list',
  templateUrl: './marker-overview-list.component.html',
  styleUrls: [
    './marker-overview-list.component.scss',
  ],
})
export class MarkerOverviewListComponent implements OnInit {
  @Output() markerAdd = new EventEmitter<Marker[]>();

  markers: Marker[] = [];
  selectedMarkers: Marker[] = [];

  constructor(private readonly markerService: MarkerService) {}

  ngOnInit() {
    this.markerService.getAll().subscribe((result) => {
      this.markers = result.data.markers;
    });
  }

  addMarker() {
    this.markerAdd.emit(this.selectedMarkers);
    this.selectedMarkers = [];
  }
}
