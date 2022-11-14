import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'koala-session-dates',
  templateUrl: './session-dates.component.html',
  styleUrls: ['./session-dates.component.scss', '../../session-common.scss'],
})
export class SessionDatesComponent implements OnInit {
  @Input() sessionDatesForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
