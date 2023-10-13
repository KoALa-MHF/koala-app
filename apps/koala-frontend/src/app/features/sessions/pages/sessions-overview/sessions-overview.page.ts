import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../types/session.entity';
import { SessionsService } from '../../services/sessions.service';
import { Subscription } from 'rxjs';
import { UserSessionService } from '../../services/user-session.service';
import { saveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Role } from '../../../../graphql/generated/graphql';

@Component({
  selector: 'koala-sessions-overview',
  templateUrl: './sessions-overview.page.html',
  styleUrls: [
    './sessions-overview.page.scss',
    '../../session-common.scss',
  ],
})
export class SessionsOverviewPage implements OnInit, OnDestroy {
  qrCodeVisible = false;
  sessions: Session[] = [];
  routeSubscription: Subscription | undefined;
  createSessionModal = false;
  createSessionForm!: FormGroup;
  showDeleteConfirm = false;
  selectedSessions?: Session[];
  selectedSession?: Session;
  userRole = Role.Guest;
  Role = Role;

  constructor(
    private readonly sessionService: SessionsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userSessionService: UserSessionService,
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.data.subscribe(() => {
      this.loadSessions();
    });

    this.createSessionForm = new FormGroup({
      name: new FormControl<string>('', [
        Validators.required,
      ]),
    });

    this.authService.me().subscribe((response) => {
      this.userRole = response.role;
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  private loadSessions() {
    this.sessionService.getAll().subscribe({
      next: (sessions) => {
        this.sessions = sessions;
      },
    });
  }

  public onSessionCreateRequested() {
    this.createSessionModal = true;
  }

  public onCreateSession() {
    const name = this.createSessionForm.get('name')?.value;

    if (name) {
      this.sessionService
        .create({
          name,
        })
        .subscribe((result) => {
          this.router.navigate([
            'sessions/update',
            result.data?.createSession.id,
          ]);
        });
    }
  }

  public onSessionUpdate(session: Session) {
    this.router.navigate([
      'sessions/update',
      session.id,
    ]);
  }

  public onSessionEnter(session: Session) {
    this.router.navigate([
      `sessions/${session.id}`,
    ]);
  }

  public onSessionExport(sessions: Session[]) {
    sessions.forEach((session) => {
      this.sessionService.createSessionJSON(parseInt(session.id)).subscribe({
        next: (result) => {
          const blob = new Blob(
            [
              JSON.stringify(result),
            ],
            { type: 'application/json;charset=utf-8' }
          );
          saveAs(blob, `${result.name}_${result.id}.json`);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('SESSION.EXPORT_SESSION_ERROR_TITLE'),
            detail: this.translateService.instant('SESSION.EXPORT_SESSION_ERROR_MESSAGE', {
              sessionName: session.name,
            }),
          });
        },
      });
    });
  }

  public onSessionDelete(sessions: Session[]) {
    //confirm deletion first
    this.selectedSessions = sessions;
    this.selectedSession = sessions[0];

    this.showDeleteConfirm = true;
  }

  public onSessionDeleteCancel() {
    this.selectedSessions = [];
    this.showDeleteConfirm = false;
  }

  public onSessionDeleteConfirmed(sessions: Session[]) {
    sessions.forEach((session) => {
      this.sessionService.delete(parseInt(session.id)).subscribe({
        next: () => {
          this.showDeleteConfirm = false;
          this.loadSessions();
        },
      });
    });
  }

  public onCancel() {
    this.createSessionForm.reset();
    this.createSessionModal = false;
  }

  public onSessionCopy(selectedSession: Session) {
    this.sessionService.copySession(parseInt(selectedSession.id)).then(() => {
      this.loadSessions();
    });
  }

  public onSessionCodeDisplay(session: Session) {
    this.qrCodeVisible = true;
    this.selectedSession = session;
  }

  public onSessionLeave(session: Session) {
    const userSession = this.userSessionService.getOwnUserSession(session);

    this.userSessionService.removeParticipantFromSession(userSession?.id || 0).subscribe({
      next: () => this.loadSessions(),
    });
  }
}
