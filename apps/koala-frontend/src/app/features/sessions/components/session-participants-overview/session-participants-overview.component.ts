import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'koala-session-participants-overview',
  templateUrl: './session-participants-overview.component.html',
  styleUrls: ['./session-participants-overview.component.scss', '../../session-common.scss'],
})
export class SessionParticipantsOverviewComponent implements OnInit {
  participants = [
    {
      nr: 1,
      email: 'bla@blubb.de',
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  public onDelete(particpant: any) {}
}
