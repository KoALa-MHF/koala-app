import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Session } from 'apps/koala-frontend/src/app/generated/graphql';

@Component({
  selector: 'koala-app-sessions-overview-table',
  templateUrl: './sessions-overview-table.component.html',
  styleUrls: ['./sessions-overview-table.component.scss']
})
export class SessionsOverviewTableComponent implements OnInit {
  @Input()
  sessions: Session[] = [];

  @Output()
  sessionDeleted: EventEmitter<Session> = new EventEmitter<Session>();
  @Output()
  sessionCreate: EventEmitter<null> = new EventEmitter<null>();

  displayedColumns: string[] = ['name', 'createdDate', 'updatedDate', 'delete'];

  constructor() {}

  ngOnInit(): void {}

  public onSessionDelete(session: Session) {
    this.sessionDeleted.emit(session);
  }
}
