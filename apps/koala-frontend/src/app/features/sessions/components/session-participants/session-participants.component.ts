import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserSession } from '../../types/user-session.entity';

@Component({
  selector: 'koala-session-participants',
  templateUrl: './session-participants.component.html',
  styleUrls: [
    './session-participants.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionParticipantsComponent {
  @Input() participants: UserSession[] = [];

  @Output() participantRemove = new EventEmitter<UserSession>();
  @Output() participantAdd = new EventEmitter<UserSession>();
  @Output() invite = new EventEmitter<string>();

  public onParticipantRemove(participant: UserSession) {
    this.participantRemove.emit(participant);
  }

  public onParticipantAdd(participant: UserSession) {
    this.participantAdd.emit(participant);
  }

  public onInvite(message: string) {
    this.invite.emit(message);
  }
}
