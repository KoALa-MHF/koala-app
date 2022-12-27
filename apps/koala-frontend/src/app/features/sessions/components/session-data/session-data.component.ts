import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'koala-session-data',
  templateUrl: './session-data.component.html',
  styleUrls: [
    './session-data.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionDataComponent implements OnInit {
  @Input() basicDataForm!: FormGroup;
  @Input() sessionDatesForm!: FormGroup;
  @Input() sessionDetailsForm!: FormGroup;

  @Output() sessionDataSave: EventEmitter<boolean> = new EventEmitter();
  @Output() sessionDataCancel: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  public onSave() {
    this.sessionDataSave.emit(true);
  }

  public onCancel() {
    this.sessionDataCancel.emit(true);
  }
}
