import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'koala-session-audio',
  templateUrl: './session-audio.component.html',
  styleUrls: ['./session-audio.component.scss', '../../session-common.scss'],
})
export class SessionAudioComponent implements OnInit {
  @Input() audioForm!: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
