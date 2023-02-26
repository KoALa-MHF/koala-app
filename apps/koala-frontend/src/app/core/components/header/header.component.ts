import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { map, merge } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth.service';

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
  LANGUAGE_CODE = LANGUAGE_CODE;

  @ViewChild('languageSelector', { static: true }) languageSelector!: OverlayPanel;

  isAuthenticated$ = this.authService.isAuthenticated$;
  language$ = merge(this.translateService.onDefaultLangChange, this.translateService.onLangChange).pipe(
    map((event) => event.lang),
    map((lang: string) => {
      return lang !== LANGUAGE_CODE.ENGLISH ? lang : 'gb';
    })
  );

  constructor(
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly authService: AuthService
  ) {}

  public onToolbarHomePressed() {
    this.router.navigate([
      '',
    ]);
  }

  public onLanguageSelected(languageCode: LANGUAGE_CODE) {
    this.languageSelector.hide();
    this.languageChange.emit(languageCode);
  }

  public onLogout() {
    this.authService.logout();
  }
}
