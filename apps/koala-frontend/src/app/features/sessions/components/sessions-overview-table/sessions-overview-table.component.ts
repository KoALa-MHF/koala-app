import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Session } from '../../types/session.entity';
import { Router } from '@angular/router';

@Component({
  selector: 'koala-sessions-overview-table',
  templateUrl: './sessions-overview-table.component.html',
  styleUrls: [
    './sessions-overview-table.component.scss',
  ],
})
export class SessionsOverviewTableComponent {
  @Input()
  sessions: Session[] = [];

  @Output() sessionDelete = new EventEmitter<Session>();
  @Output() sessionCreate = new EventEmitter<void>();
  @Output() sessionUpdate = new EventEmitter<Session>();
  @Output() sessionEnter = new EventEmitter<Session>();
  @Output() sessionExport = new EventEmitter<Session>();
  @Output() sessionCopy = new EventEmitter<Session>();

  selectedSession: Session | null = null;

  displayedColumns: string[] = [
    'name',
    'createdAt',
    'participants',
    'updatedAt',
    'settings',
    'sessionCode',
    'export',
    'delete',
  ];

  constructor(private readonly router: Router) {}

  public onSessionDelete(session: Session) {
    if (this.selectedSession?.id === session.id) {
      //cleanup selected session
      this.selectedSession = null;
    }
    this.sessionDelete.emit(session);
  }

  public onSessionCreate() {
    this.sessionCreate.emit();
  }

  public onCodePressed(session: Session) {
    console.log('Code Pressed for session: ' + JSON.stringify(session));
  }

  public onExport(session: Session) {
    this.sessionExport.emit(session);
  }

  public onSettings(session: Session) {
    this.sessionUpdate.emit(session);
  }

  public onSessionEnter() {
    if (this.selectedSession) {
      this.sessionEnter.emit(this.selectedSession);
    }
  }

  public onSessionCopy() {
    if (this.selectedSession) {
      this.sessionCopy.emit(this.selectedSession);
    }
  }
}
