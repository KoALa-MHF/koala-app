import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { MarkerType } from '../../../../graphql/generated/graphql';
import { MarkerEntity } from '../../types/marker-entity';

@Component({
  selector: 'koala-marker-placement',
  templateUrl: './marker-placement.component.html',
  styleUrls: [
    './marker-placement.component.scss',
    '../../session-common.scss',
  ],
})
export class MarkerPlacementComponent {
  @Input() markers!: MarkerEntity[];
  MarkerType = MarkerType;

  drop(event: CdkDragDrop<string[]>) {
    const sortMarkers = [
      ...this.markers,
    ];
    moveItemInArray(sortMarkers, event.previousIndex, event.currentIndex);

    this.markers = sortMarkers;
  }
}
