import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'koala-session-participants-overview',
  templateUrl: './session-participants-overview.component.html',
  styleUrls: [
    './session-participants-overview.component.scss',
    '../../session-common.scss',
  ],
})
export class SessionParticipantsOverviewComponent implements OnInit {
  @Input() participants = [];
  @Output()
  participantRemove: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  public onDelete(particpant: any) {
    this.participantRemove.emit(particpant);
  }
}
