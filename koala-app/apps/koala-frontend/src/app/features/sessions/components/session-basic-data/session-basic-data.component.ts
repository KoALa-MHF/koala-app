import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Session } from 'apps/koala-frontend/src/app/generated/graphql';

@Component({
  selector: 'koala-app-session-basic-data',
  templateUrl: './session-basic-data.component.html',
  styleUrls: ['./session-basic-data.component.scss']
})
export class SessionBasicDataComponent implements OnInit {
  session: Session;

  @Output()
  created = new EventEmitter<Session>();

  constructor() {
    this.session = <Session>{ name: '' };
  }

  ngOnInit(): void {}

  public onCreate() {
    this.created.emit(this.session);
  }
  public onSessionNameInputChanged(event: any) {
    this.session.name = event.target.value;
  }
}
