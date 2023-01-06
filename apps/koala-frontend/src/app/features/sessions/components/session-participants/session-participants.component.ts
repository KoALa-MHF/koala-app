import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'koala-session-participants',
  templateUrl: './session-participants.component.html',
  styleUrls: [
    './session-participants.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionParticipantsComponent {
  @Input() participants = [];

  @Output() participantRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() participantAdd: EventEmitter<any> = new EventEmitter<any>();

  public onParticipantRemove(participant: any) {
    this.participantRemove.emit(participant);
  }

  public onParticipantAdd(participant: any) {
    this.participantAdd.emit(participant);
  }
}
