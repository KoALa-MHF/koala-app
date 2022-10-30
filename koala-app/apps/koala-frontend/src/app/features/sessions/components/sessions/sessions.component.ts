import { Component, OnInit } from '@angular/core';
import { SessionsService } from '../../services/sessions.service';


@Component({
  selector: 'koala-app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnInit {
  sessions: any[] = [];
  sessionName: string = 'Session 2';

  constructor(private sessionService: SessionsService) {}

  ngOnInit(): void {
    this.sessionService.getAll().subscribe((result: any) => {
        this.sessions = result.data?.sessions;
        //this.loading = result.loading;
        //this.error = result.error;
      });
  }

  public createNewSession() {
    this.sessionService.create(this.sessionName)
      .subscribe(
        () => {
          console.log('Success');
        },
        (error) => {}
      );
  }

  public onSessionNameInputChanged(event: any) {
    this.sessionName = event.target.value;
  }
}
