import { Component, EventEmitter, Output } from '@angular/core';
import { Marker } from '../../types/marker.entity';

@Component({
  selector: 'koala-session-marker-library',
  templateUrl: './session-marker-library.component.html',
  styleUrls: [
    './session-marker-library.component.scss',
  ],
})
export class SessionMarkerLibraryComponent {
  @Output() markerAdd = new EventEmitter<Marker[]>();
  showMarkerList = false;

  showMarkerListHelp() {
    this.showMarkerList = true;
  }

  onMarkerAdd(markers: Marker[]) {
    this.showMarkerList = false;
    this.markerAdd.emit(markers);
  }
}
