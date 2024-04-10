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
  leaveSession: boolean;
}

export interface SessionOverviewColumns {
  participantsCount: boolean;
  createdAt: boolean;
  changedAt: boolean;
}

export enum ExportType {
  json,
  csv,
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
    leaveSession: false,
  };
  @Input() visibleColumns: SessionOverviewColumns = {
    participantsCount: true,
    createdAt: true,
    changedAt: true,
  };

  @Output() sessionDelete = new EventEmitter<Session[]>();
  @Output() sessionCreate = new EventEmitter<void>();
  @Output() sessionUpdate = new EventEmitter<Session>();
  @Output() sessionEnter = new EventEmitter<Session>();
  @Output() sessionExport = new EventEmitter<{ exportType: ExportType; sessions: Session[] }>();
  @Output() sessionCopy = new EventEmitter<Session>();
  @Output() sessionCodeDisplay = new EventEmitter<Session>();
  @Output() sessionLeave = new EventEmitter<Session>();

  selectedSessions: Session[] = [];

  public onSessionDelete() {
    this.sessionDelete.emit(this.selectedSessions);
    this.selectedSessions = [];
  }

  public onSessionCreate() {
    this.sessionCreate.emit();
  }

  public onCodePressed(session: Session) {
    this.sessionCodeDisplay.emit(session);
  }

  public onJSONExport() {
    this.sessionExport.emit({ exportType: ExportType.json, sessions: this.selectedSessions });
  }

  public onCSVExport() {
    this.sessionExport.emit({ exportType: ExportType.csv, sessions: this.selectedSessions });
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

  public onSessionLeave(session: Session) {
    this.sessionLeave.emit(session);
  }
}
