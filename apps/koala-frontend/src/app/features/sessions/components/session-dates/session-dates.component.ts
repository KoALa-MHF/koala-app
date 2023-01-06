import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'koala-session-dates',
  templateUrl: './session-dates.component.html',
  styleUrls: [
    './session-dates.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionDatesComponent {
  @Input() sessionDatesForm!: FormGroup;

  get start() {
    return this.sessionDatesForm.get('start')?.value;
  }

  get end() {
    return this.sessionDatesForm.get('end')?.value;
  }

  get online(): boolean {
    return this.sessionDatesForm.get('online')?.value;
  }
}
