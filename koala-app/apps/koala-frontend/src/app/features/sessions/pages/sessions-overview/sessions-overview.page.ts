import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionsService } from '../../services/sessions.service';

@Component({
  selector: 'koala-app-sessions-overview',
  templateUrl: './sessions-overview.page.html',
  styleUrls: ['./sessions-overview.page.scss'],
})
export class SessionsOverviewPage implements OnInit {
  sessions: any[] = [];
  displayedColumns: string[] = ['name', 'createdDate', 'updatedDate', 'delete'];

  constructor(
    private readonly sessionService: SessionsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.sessionService.getAll().subscribe((result: any) => {
      this.sessions = result.data?.sessions;
      //this.loading = result.loading;
      //this.error = result.error;
    });
  }

  public onSessionCreate() {
    this.router.navigate(['sessions/create']);
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
