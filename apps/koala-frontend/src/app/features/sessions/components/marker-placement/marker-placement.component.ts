import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Marker } from '../../types/marker.entity';

@Component({
  selector: 'koala-marker-placement',
  templateUrl: './marker-placement.component.html',
  styleUrls: [
    './marker-placement.component.scss',
    '../../session-common.scss',
  ],
})
export class MarkerPlacementComponent {
  @Input() markers!: Marker[];
  @Output() sortChange = new EventEmitter<Marker[]>();

  onSortChange(markers: Marker[]) {
    this.sortChange.emit(markers);
  }
}
