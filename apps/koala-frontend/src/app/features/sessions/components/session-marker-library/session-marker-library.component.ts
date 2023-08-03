import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MarkerService } from '../../services/marker.service';
import { Marker } from '../../types/marker.entity';

@Component({
  selector: 'koala-session-marker-library',
  templateUrl: './session-marker-library.component.html',
  styleUrls: [
    './session-marker-library.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionMarkerLibraryComponent implements OnInit {
  @Output() markerAdd = new EventEmitter<Marker[]>();
  showMarkerList = false;
  markers: Marker[] = [];
  selectedMarkers: Marker[] = [];

  constructor(private readonly markerService: MarkerService) {}

  ngOnInit() {
    this.loadAllMarker();
  }

  onMarkerAdd() {
    this.showMarkerList = false;
    this.markerAdd.emit(this.selectedMarkers);
  }

  showMarkerListHelp() {
    this.loadAllMarker();
    this.selectedMarkers = [];
    this.showMarkerList = true;
  }

  private loadAllMarker() {
    this.markerService.getAll().subscribe((result) => {
      this.markers = result.data.markers.map((marker) => {
        return { ...marker, visible: true };
      });
    });
  }
}
