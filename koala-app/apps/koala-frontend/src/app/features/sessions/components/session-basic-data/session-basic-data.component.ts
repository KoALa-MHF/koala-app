import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'koala-session-basic-data',
  templateUrl: './session-basic-data.component.html',
  styleUrls: ['./session-basic-data.component.scss', '../../session-common.scss'],
})
export class SessionBasicDataComponent implements OnInit {
  @Input() basicDataForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
