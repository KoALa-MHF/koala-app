import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from 'apps/koala-frontend/src/app/graphql/generated/graphql';
import { SessionsService } from '../../services/sessions.service';

@Component({
  selector: 'koala-sessions-overview',
  templateUrl: './sessions-overview.page.html',
  styleUrls: ['./sessions-overview.page.scss'],
})
export class SessionsOverviewPage implements OnInit {
  sessions: Session[] = [];

  constructor(
    private readonly sessionService: SessionsService,
    private readonly router: Router
  ) {
    this.sessionService.getAll().subscribe((result) => {
      this.sessions = result.data?.sessions;
      //this.loading = result.loading;
      //this.error = result.error;
    });
  }

  ngOnInit(): void {}

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
        console.log('Success');
      },
      (error) => {}
    );
  }
}
