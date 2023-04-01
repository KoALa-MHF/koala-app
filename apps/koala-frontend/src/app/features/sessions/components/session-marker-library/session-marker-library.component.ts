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

  constructor(private readonly markerService: MarkerService) {}

  ngOnInit() {
    this.loadAllMarker();
  }

  onMarkerAdd(markers: Marker[]) {
    this.showMarkerList = false;
    this.markerAdd.emit(markers);
  }

  showMarkerListHelp() {
    this.loadAllMarker();
    this.showMarkerList = true;
  }

  private loadAllMarker() {
    this.markerService.getAll().subscribe((result) => {
      this.markers = result.data.markers.map((marker) => {
        return {
          id: marker.id,
          name: marker.name,
          type: marker.type,
          color: marker.color,
          hidden: false,
          abbreviation: marker.abbreviation,
          description: marker.description,
          icon: marker.icon,
        };
      });
    });
  }
}
