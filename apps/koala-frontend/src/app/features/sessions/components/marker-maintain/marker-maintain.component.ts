import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'koala-marker-maintain',
  templateUrl: './marker-maintain.component.html',
  styleUrls: ['./marker-maintain.component.scss', '../../session-common.scss'],
})
export class MarkerMaintainComponent implements OnInit {
  markerTypes = [
    {
      type: 1,
      name: 'Spot',
    },
    {
      type: 2,
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

  constructor() {}

  ngOnInit(): void {}
}
