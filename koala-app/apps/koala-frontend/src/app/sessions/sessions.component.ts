import { Component, OnInit } from '@angular/core';

import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'koala-app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnInit {
  sessions: any[] = [];
  sessionName: string = 'Session 2';

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.apollo
      .watchQuery({
        query: gql`
          {
            sessions {
              id
              name
            }
          }
        `,
        pollInterval: 500
      })
      .valueChanges.subscribe((result: any) => {
        this.sessions = result.data?.sessions;
        //this.loading = result.loading;
        //this.error = result.error;
      });
  }

  public createNewSession() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation createNewSession($sessionName: String!) {
            createSession(createSessionInput: { name: $sessionName }) {
              id
              name
            }
          }
        `,
        variables: {
          sessionName: this.sessionName,
        },
      })
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
