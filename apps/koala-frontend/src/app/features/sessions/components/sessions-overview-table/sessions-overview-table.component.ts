import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from 'apps/koala-frontend/src/app/graphql/generated/graphql';

@Component({
  selector: 'koala-sessions-overview-table',
  templateUrl: './sessions-overview-table.component.html',
  styleUrls: ['./sessions-overview-table.component.scss'],
})
export class SessionsOverviewTableComponent implements OnInit {
  @Input()
  sessions: Session[] = [];

  @Output()
  sessionDelete: EventEmitter<Session> = new EventEmitter<Session>();
  @Output()
  sessionCreate: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  sessionUpdate: EventEmitter<Session> = new EventEmitter<Session>();
  @Output()
  sessionExport: EventEmitter<Session> = new EventEmitter<Session>();

  displayedColumns: string[] = [
    'name',
    'createdAt',
    'participants',
    'updatedAt',
    'sessionType',
    'settings',
    'sessionCode',
    'export',
    'delete',
  ];

  constructor(private readonly router: Router) {}

  ngOnInit(): void {}

  public onSessionDelete(session: Session) {
    this.sessionDelete.emit(session);
  }

  public onSessionCreate() {
    this.sessionCreate.emit();
    
  }

  public onCodePressed(session: Session) {}

  public onExport(session: Session) {
    this.sessionExport.emit(session);
  }

  public onSettings(session: Session) {
    this.sessionUpdate.emit(session);
  }
}
