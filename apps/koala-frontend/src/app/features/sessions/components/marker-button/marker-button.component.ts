import { Component, Input } from '@angular/core';
import { MarkerEntity } from '../../types/marker-entity';
import { MarkerType } from '../../../../graphql/generated/graphql';

@Component({
  selector: 'koala-marker-button',
  templateUrl: './marker-button.component.html',
  styleUrls: [
    './marker-button.component.scss',
  ],
})
export class MarkerButtonComponent {
  @Input() marker!: MarkerEntity;
  MarkerType = MarkerType;
}
