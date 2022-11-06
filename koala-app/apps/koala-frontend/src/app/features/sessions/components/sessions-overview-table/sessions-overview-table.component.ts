import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from 'apps/koala-frontend/src/app/graphql/generated/graphql';

@Component({
  selector: 'koala-app-sessions-overview-table',
  templateUrl: './sessions-overview-table.component.html',
  styleUrls: ['./sessions-overview-table.component.scss'],
})
export class SessionsOverviewTableComponent implements OnInit {
  @Input()
  sessions: Session[] = [];

  @Output()
  sessionDeleted: EventEmitter<Session> = new EventEmitter<Session>();
  @Output()
  sessionCreate: EventEmitter<null> = new EventEmitter<null>();

  displayedColumns: string[] = [
    'name',
    'createdDate',
    'participants',
    'updatedDate',
    'sessionType',
    'settings',
    'sessionCode',
    'export',
    'delete',
  ];

  constructor(private readonly router: Router) {}

  ngOnInit(): void {}

  public onSessionDelete(session: Session) {
    this.sessionDeleted.emit(session);
  }

  public onSessionCreate() {
    this.router.navigate(['sessions/create']);
  }

  public onCodePressed(session: Session) {}

  public onExport(session: Session) {}

  public onSettings(session: Session) {}
}
