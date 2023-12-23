import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'koala-session-data',
  templateUrl: './session-data.component.html',
  styleUrls: [
    './session-data.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionDataComponent {
  @Input() basicDataForm!: FormGroup;
  @Input() sessionDatesForm!: FormGroup;
  @Input() sessionDetailsForm!: FormGroup;
}
