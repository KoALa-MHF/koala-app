import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Marker } from '../../types/marker.entity';

@Component({
  selector: 'koala-marker-toolbar',
  templateUrl: './marker-toolbar.component.html',
  styleUrls: [
    './marker-toolbar.component.scss',
  ],
})
export class MarkerToolbarComponent {
  @Input() markers!: Marker[];
  @Output() sortChange = new EventEmitter<Marker[]>();

  dropped(event: { previousIndex: number; currentIndex: number }) {
    const tempMarker = [
      ...this.markers,
    ];
    moveItemInArray(tempMarker, event.previousIndex, event.currentIndex);
    this.markers = tempMarker;

    this.sortChange.emit(this.markers);
  }
}
