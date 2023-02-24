import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

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

  constructor(private readonly router: Router) {}

  public onToolbarHomePressed() {
    this.router.navigate([
      '',
    ]);
  }
}
