import { Component, Input, OnInit } from '@angular/core';
import { MarkerType } from 'apps/koala-frontend/src/app/graphql/generated/graphql';
import { MarkerEntity } from '../../types/marker-preview';

@Component({
  selector: 'koala-marker-placement',
  templateUrl: './marker-placement.component.html',
  styleUrls: [
    './marker-placement.component.scss',
    '../../session-common.scss',
  ],
})
export class MarkerPlacementComponent implements OnInit {
  @Input() markers!: MarkerEntity[];
  MarkerType = MarkerType;

  constructor() {}

  ngOnInit(): void {}
}
