import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'koala-session-participants-invitation',
  templateUrl: './session-participants-invitation.component.html',
  styleUrls: [
    './session-participants-invitation.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionParticipantsInvitationComponent {
  invitationMessage = '';
  @Output() invite = new EventEmitter<string>();

  public onInviteParticipants() {
    this.invite.emit(this.invitationMessage);
  }
}
