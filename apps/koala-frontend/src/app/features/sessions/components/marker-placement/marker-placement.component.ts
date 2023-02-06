import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() sortChange = new EventEmitter<MarkerEntity[]>();

  onSortChange(markers: MarkerEntity[]) {
    this.sortChange.emit(markers);
  }
}
