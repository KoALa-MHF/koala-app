import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from 'apps/koala-frontend/src/app/generated/graphql';
import { SessionsService } from '../../services/sessions.service';

@Component({
  selector: 'koala-app-session-create',
  templateUrl: './session-create.component.html',
  styleUrls: ['./session-create.component.scss'],
})
export class SessionCreatePage implements OnInit {
  sessionName: string = 'Session 2';

  constructor(private readonly sessionService: SessionsService,
                private readonly router: Router) {}

  ngOnInit(): void {}

  public onSessionCreated(session: Session) {
    this.sessionService.create(session.name).subscribe(() => {
        this.router.navigate(['sessions']);
    });
  }
}
