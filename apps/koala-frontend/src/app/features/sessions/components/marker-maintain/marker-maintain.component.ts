import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MarkerType } from 'apps/koala-frontend/src/app/graphql/generated/graphql';

@Component({
  selector: 'koala-marker-maintain',
  templateUrl: './marker-maintain.component.html',
  styleUrls: [
    './marker-maintain.component.scss',
    '../../session-common.scss',
  ],
})
export class MarkerMaintainComponent implements OnInit {
  @Input() markerDataForm!: FormGroup;

  markerTypes = [
    {
      type: MarkerType.Event,
      name: 'Event',
    },
    {
      type: MarkerType.Range,
      name: 'Range',
    },
  ];

  icons = [
    {
      code: 1,
      name: 'Spot',
    },
    {
      code: 2,
      name: 'Range',
    },
  ];
  selectedIcon: number = 0;
  selectedMarkerType: number = 0;
  color: string = '';
  abbreviation: string = '';

  MarkerType = MarkerType;

  constructor() {}

  ngOnInit(): void {}

  get markerType() {
    return this.markerDataForm.get('type')?.value;
  }
}
