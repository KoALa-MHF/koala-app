import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'koala-session-marker-data',
  templateUrl: './session-marker-data.component.html',
  styleUrls: [
    './session-marker-data.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionMarkerDataComponent implements OnInit {
  @Input() markerDataForm!: FormGroup;
  @Output() newMarkerDataChange = new EventEmitter<any>();
  
  constructor() {}

  ngOnInit(): void {}

  public onAbbreviationChange(abbreviation: string) {
    this.newMarkerDataChange.emit({
      abbreviation,
    });
  }
}
