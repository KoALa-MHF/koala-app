import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'koala-marker-maintain',
  templateUrl: './marker-maintain.component.html',
  styleUrls: ['./marker-maintain.component.scss', '../../session-common.scss'],
})
export class MarkerMaintainComponent implements OnInit {
  @Input() markerDataForm!: FormGroup;

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
  abbreviation: string = '';

  @Output() markerTypeChange = new EventEmitter<string>();
  @Output() abbreviationChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  public onAbbreviationChange(event: Event) {
    const input = event.target as HTMLInputElement;

    this.abbreviation = input.value;
    this.abbreviationChange.emit(this.abbreviation);
  }
}
