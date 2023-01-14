import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../../../graphql/generated/graphql';
import { SessionsService } from '../../services/sessions.service';

@Component({
  selector: 'koala-sessions-overview',
  templateUrl: './sessions-overview.page.html',
  styleUrls: [
    './sessions-overview.page.scss',
    '../../session-common.scss',
  ],
})
export class SessionsOverviewPage implements OnInit {
  sessions: Session[] = [];
  routeSubscription: any;
  createSessionModal = false;
  createSessionForm!: FormGroup;
  showDeleteConfirm = false;
  selectedSession?: Session;

  constructor(
    private readonly sessionService: SessionsService,
    private readonly router: Router,
    private route: ActivatedRoute
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
  }

  private loadSessions() {
    this.sessionService.getAll().then((result) => {
      this.sessions = result.data?.sessions;
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

  public onSessionExport(session: Session) {
    console.log('Session Export Pressed for Session: ' + session.id + ', ' + session.name);
  }

  public onSessionDelete(session: Session) {
    //confirm deletion first
    this.selectedSession = session;
    this.showDeleteConfirm = true;
  }

  public onSessionDeleteCancel() {
    this.selectedSession = undefined;
    this.showDeleteConfirm = false;
  }

  public onSessionDeleteConfirmed(sessionId: string) {
    this.sessionService.delete(parseInt(sessionId)).subscribe({
      next: (value) => {
        this.showDeleteConfirm = false;
        this.loadSessions();
      },
      error: (err) => {},
    });
  }

  public onCancel() {
    this.createSessionForm.reset();
    this.createSessionModal = false;
  }
}
