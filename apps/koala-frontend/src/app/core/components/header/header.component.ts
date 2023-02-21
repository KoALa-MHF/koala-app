import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SessionsService } from '../../../features/sessions/services/sessions.service';

export enum LANGUAGE_CODE {
  GERMAN = 'de',
  ENGLISH = 'en',
  FRENCH = 'fr',
}

@Component({
  selector: 'koala-header',
  templateUrl: './header.component.html',
  styleUrls: [
    './header.component.scss',
  ],
})
export class HeaderComponent {
  @Output() languageChange: EventEmitter<LANGUAGE_CODE> = new EventEmitter<LANGUAGE_CODE>();
  sessionSelected = false;

  selectedSessionChangeSubscription = this.sessionService.selectedSessionChanged$.subscribe({
    next: () => {
      this.sessionSelected = true;
    },
  });

  languages: MenuItem[] = [
    {
      label: 'Deutsch',
      id: LANGUAGE_CODE.GERMAN,
      command: (event) => {
        this.languageChange.emit(event.item.id);
      },
    },
    {
      label: 'English',
      id: LANGUAGE_CODE.ENGLISH,
      command: (event) => {
        this.languageChange.emit(event.item.id);
      },
    },
    {
      label: 'Français',
      id: LANGUAGE_CODE.FRENCH,
      command: (event) => {
        this.languageChange.emit(event.item.id);
      },
    },
  ];

  constructor(private readonly router: Router, private readonly sessionService: SessionsService) {}

  public onToolbarHomePressed() {
    this.router.navigate([
      '',
    ]);
  }

  public onSessionCreate() {
    this.sessionService.requestCreateSession();
  }

  public onSessionDuplicate() {
    this.sessionService.requestDuplicateSession();
  }

  public onSessionEnter() {
    this.sessionService.requestEnterSession();
  }
}
