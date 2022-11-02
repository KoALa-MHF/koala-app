import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Session } from 'apps/koala-frontend/src/app/generated/graphql';

@Component({
  selector: 'koala-app-sessions-overview-table',
  template: `
    <table mat-table [dataSource]="sessions" class="mat-elevation-z8">
      <!-- Name Column -->
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let session">{{ session.name }}</td>
      </ng-container>

      <!-- Creation Date Column -->
      <ng-container matColumnDef="createdDate">
        <th mat-header-cell *matHeaderCellDef>Erstellungsdatum</th>
        <td mat-cell *matCellDef="let session">
          {{ session.createdDate | date: 'medium' }}
        </td>
      </ng-container>

      <!-- Updated Date Column -->
      <ng-container matColumnDef="updatedDate">
        <th mat-header-cell *matHeaderCellDef>Änderungsdatum</th>
        <td mat-cell *matCellDef="let session">
          {{ session.updatedDate | date: 'medium' }}
        </td>
      </ng-container>

      <!-- Delete Action Column -->
      <ng-container matColumnDef="delete">
        <th mat-header-cell *matHeaderCellDef>Delete</th>
        <td mat-cell *matCellDef="let session">
          <button
            mat-icon-button
            aria-label="Delete Session"
            (click)="onSessionDelete(session)"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: [
    `
      table {
        width: 100%;
        
      }
    `,
  ],
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
