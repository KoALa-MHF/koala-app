import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'koala-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss', '../../session-common.scss'],
})
export class SessionDetailsComponent implements OnInit {
  @Input() sessionDetailsForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
