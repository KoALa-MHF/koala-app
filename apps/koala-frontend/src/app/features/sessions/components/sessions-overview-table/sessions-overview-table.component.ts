import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Session } from '../../types/session.entity';

export interface SessionOverviewActions {
  createSession: boolean;
  copySession: boolean;
  enterSession: boolean;
  deleteSession: boolean;
  exportSession: boolean;
  updateSession: boolean;
  displaySessionCode: boolean;
}

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
  @Input() supportedActions: SessionOverviewActions = {
    createSession: true,
    copySession: true,
    enterSession: true,
    deleteSession: true,
    exportSession: true,
    updateSession: true,
    displaySessionCode: true,
  };

  @Output() sessionDelete = new EventEmitter<Session[]>();
  @Output() sessionCreate = new EventEmitter<void>();
  @Output() sessionUpdate = new EventEmitter<Session>();
  @Output() sessionEnter = new EventEmitter<Session>();
  @Output() sessionExport = new EventEmitter<Session[]>();
  @Output() sessionCopy = new EventEmitter<Session>();
  @Output() sessionCodeDisplay = new EventEmitter<Session>();

  selectedSessions: Session[] = [];

  displayedColumns: string[] = [
    'name',
    'createdAt',
    'participants',
    'updatedAt',
    'settings',
    'sessionCode',
    'copy',
    'enter',
  ];

  public onSessionDelete() {
    this.sessionDelete.emit(this.selectedSessions);
  }

  public onSessionCreate() {
    this.sessionCreate.emit();
  }

  public onCodePressed(session: Session) {
    this.sessionCodeDisplay.emit(session);
  }

  public onExport() {
    this.sessionExport.emit(this.selectedSessions);
  }

  public onSettings(session: Session) {
    this.sessionUpdate.emit(session);
  }

  public onSessionEnter(session: Session) {
    this.sessionEnter.emit(session);
  }

  public onSessionCopy(session: Session) {
    this.sessionCopy.emit(session);
  }
}
