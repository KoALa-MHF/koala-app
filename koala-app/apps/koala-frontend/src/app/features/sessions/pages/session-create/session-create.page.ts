import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateSessionInput } from 'apps/koala-frontend/src/app/generated/graphql';
import { SessionsService } from '../../services/sessions.service';

@Component({
  selector: 'koala-app-session-create',
  templateUrl: './session-create.page.html',
  styleUrls: ['./session-create.page.scss'],
})
export class SessionCreatePage implements OnInit {
  sessionName: string = '';

  constructor(private readonly sessionService: SessionsService,
                private readonly router: Router) {}

  ngOnInit(): void {}

  public onSessionCreated(session: CreateSessionInput) {
    this.sessionService.create(session.name).subscribe(() => {
        this.router.navigate(['sessions']);
    });
  }
}
