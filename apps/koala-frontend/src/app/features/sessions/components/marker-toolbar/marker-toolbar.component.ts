import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { MarkerEntity } from '../../types/marker-entity';

@Component({
  selector: 'koala-marker-toolbar',
  templateUrl: './marker-toolbar.component.html',
  styleUrls: [
    './marker-toolbar.component.scss',
  ],
})
export class MarkerToolbarComponent {
  @Input() markers!: MarkerEntity[];

  dropped(event: { previousIndex: number; currentIndex: number }) {
    const tempMarker = [
      ...this.markers,
    ];
    moveItemInArray(tempMarker, event.previousIndex, event.currentIndex);
    this.markers = tempMarker;
  }
}
