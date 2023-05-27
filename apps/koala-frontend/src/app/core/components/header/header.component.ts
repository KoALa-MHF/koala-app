import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { filter, map, merge } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth.service';
import { environment } from '../../../../environments/environment';
import { NavigationService } from '../../../features/sessions/services/navigation.service';
import { SessionsService } from '../../../features/sessions/services/sessions.service';
import { ApolloQueryResult } from '@apollo/client/core';
import { GetOneSessionQuery } from '../../../graphql/generated/graphql';

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
  @Output() languageChange = new EventEmitter<LANGUAGE_CODE>();
  @Output() userProfileEditRequest = new EventEmitter<void>();

  LANGUAGE_CODE = LANGUAGE_CODE;

  @ViewChild('languageSelector', { static: true }) languageSelector!: OverlayPanel;
  @ViewChild('accountMenu', { static: true }) accountMenu!: OverlayPanel;

  isOnAnySessionPage = false;
  isOnSessionPage = false;
  sessionId = -1;
  isUserSessionOwner = false;

  isAuthenticated$ = this.authService.isAuthenticated$;
  language$ = merge(this.translateService.onDefaultLangChange, this.translateService.onLangChange).pipe(
    map((event) => event.lang),
    map((lang: string) => {
      return lang !== LANGUAGE_CODE.ENGLISH ? lang : 'gb';
    })
  );
  isSessionAnalysisNavEnabled$ = this.navigationService.sessionAnalysisNavEnabledToggled$;

  constructor(
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly authService: AuthService,
    private readonly navigationService: NavigationService,
    private readonly sessionService: SessionsService
  ) {
    this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd)).subscribe((event) => {
      const routeUrl: string = event.url;
      if (routeUrl.match('^/sessions/[^a-zA-Z]') !== null) {
        this.isOnAnySessionPage = true;
        const sessionIdInURL = routeUrl.match('[1-9]+');
        if (sessionIdInURL) {
          this.sessionId = parseInt(sessionIdInURL[0]);
          this.sessionService.getOne(this.sessionId).subscribe({
            next: (response: ApolloQueryResult<GetOneSessionQuery>) => {
              const selectedSession = response.data.session;

              this.isUserSessionOwner = selectedSession.owner.id === this.authService.getLoggedInUserId().toString();
            },
          });
        }

        const sessionDetailsURL = routeUrl.match('^/sessions/[^a-zA-Z]*/.');
        if (!sessionDetailsURL) {
          this.isOnSessionPage = true;
        } else {
          this.isOnSessionPage = false;
        }
      } else {
        this.isOnAnySessionPage = false;
        this.isOnSessionPage = false;
      }
    });
  }

  public onToolbarHomePressed() {
    this.router.navigate([
      '',
    ]);
  }

  public onMySessions() {
    this.router.navigate([
      '',
    ]);
  }

  public onSession() {
    this.router.navigate([
      '/sessions/' + this.sessionId,
    ]);
  }

  public onAnalysis() {
    this.router.navigate([
      '/sessions/' + this.sessionId + '/analysis',
    ]);
  }

  public onSessionInfo() {
    this.router.navigate([
      '/sessions/' + this.sessionId + '/info',
    ]);
  }

  public onSessionSettings() {
    this.navigationService.setSessionSettingsSidePanelVisible(true);
  }

  public onLanguageSelected(languageCode: LANGUAGE_CODE) {
    this.languageSelector.hide();
    this.languageChange.emit(languageCode);
  }

  public onLogin() {
    window.location.href = environment.samlUrl;
  }

  public onLogout() {
    this.accountMenu.hide();
    this.authService.logout();
  }

  public onProfileEdit() {
    this.accountMenu.hide();
    this.userProfileEditRequest.emit();
  }
}
