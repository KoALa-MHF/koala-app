import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from 'apps/koala-frontend/src/app/graphql/generated/graphql';
import { SessionsService } from '../../services/sessions.service';

@Component({
  selector: 'koala-sessions-overview',
  templateUrl: './sessions-overview.page.html',
  styleUrls: ['./sessions-overview.page.scss'],
})
export class SessionsOverviewPage implements OnInit {
  sessions: Session[] = [];
  routeSubscription: any;

  constructor(
    private readonly sessionService: SessionsService,
    private readonly router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.data.subscribe(() => {
      this.loadSessions();
    });
  }

  private loadSessions() {
    this.sessionService.getAll().then((result) => {
      this.sessions = result.data?.sessions;
    });
  }

  public onSessionCreate() {
    this.router.navigate(['sessions/create']);
  }

  public onSessionUpdate(session: Session) {
    this.router.navigate(['sessions/update', session.id]);
  }

  public onSessionExport(session: Session) {
    console.log(
      'Session Export Pressed for Session: ' + session.id + ', ' + session.name
    );
  }

  public onSessionDelete(session: any) {
    this.sessionService.delete(session.id).subscribe(
      () => {
        this.loadSessions();
      },
      (error) => { }
    );
  }
}
