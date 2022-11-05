import { Component, OnInit } from '@angular/core';
import { SessionsService } from '../../services/sessions.service';

@Component({
  selector: 'koala-app-sessions-overview',
  templateUrl: './sessions-overview.page.html',
  styleUrls: ['./sessions-overview.page.scss'],
})
export class SessionsOverviewPage implements OnInit {
  sessions: any[] = [];
  displayedColumns: string[] = ['name', 'createdDate', 'updatedDate', 'delete'];

  constructor(private readonly sessionService: SessionsService) {}

  ngOnInit(): void {
    this.sessionService.getAll().subscribe((result: any) => {
      this.sessions = result.data?.sessions;
      //this.loading = result.loading;
      //this.error = result.error;
    });
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
