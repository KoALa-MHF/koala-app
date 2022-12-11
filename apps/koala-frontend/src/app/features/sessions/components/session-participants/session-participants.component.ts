import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'koala-session-participants',
  templateUrl: './session-participants.component.html',
  styleUrls: [
    './session-participants.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionParticipantsComponent implements OnInit {
  @Input() participants = [];
  @Output()
  participantRemove: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  public onParticipantRemove(participant: any) {
    this.participantRemove.emit(participant);
  }
}
