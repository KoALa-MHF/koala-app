import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription, filter, map, merge } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth.service';
import { environment } from '../../../../environments/environment';
import { NavigationService } from '../../../features/sessions/services/navigation.service';
import { SessionsService } from '../../../features/sessions/services/sessions.service';
import { Role } from '../../../graphql/generated/graphql';
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
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() languageChange = new EventEmitter<LANGUAGE_CODE>();
  @Output() userProfileEditRequest = new EventEmitter<void>();

  LANGUAGE_CODE = LANGUAGE_CODE;
  SAMLLoginOptionEnabled = environment.showSAMLLoginOption;

  loginOptions!: MenuItem[];

  @ViewChild('languageSelector', { static: true }) languageSelector!: OverlayPanel;
  @ViewChild('accountMenu', { static: true }) accountMenu!: OverlayPanel;

  isOnAnySessionPage = false;
  isOnSessionPage = false;
  isOnSessionAnalysisPage = false;

  sidebarVisible = false;

  userRole = Role.Guest;
  Role = Role;
  isAuthSubscription: Subscription | undefined;

  isAuthenticated$ = this.authService.isAuthenticated$;
  language$ = merge(this.translateService.onDefaultLangChange, this.translateService.onLangChange).pipe(
    map((event) => event.lang),
    map((lang: string) => {
      return lang !== LANGUAGE_CODE.ENGLISH ? lang : 'gb';
    })
  );

  focusSessionChanged$ = this.sessionService.focusSessionChanged$;

  constructor(
    private readonly router: Router,
    private readonly translateService: TranslateService,
    private readonly authService: AuthService,
    private readonly navigationService: NavigationService,
    private readonly sessionService: SessionsService
  ) {}

  ngOnInit(): void {
    this.isAuthSubscription = this.isAuthenticated$.subscribe((authenticated) => {
      if (authenticated) {
        this.authService.me().subscribe((result) => {
          this.userRole = result.role;
        });
      } else {
        this.userRole = Role.Guest;
      }
    });

    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isOnAnySessionPage = false;
        this.isOnSessionPage = false;
        this.isOnSessionAnalysisPage = false;

        const routeUrl: string = event.url;
        if (routeUrl.match('^/sessions/[^a-zA-Z]') !== null) {
          this.isOnAnySessionPage = true;

          const sessionIdInURL = routeUrl.match('[1-9]+');
          if (sessionIdInURL) {
            this.authService.me().subscribe((result) => {
              this.userRole = result.role;
              if (!result.displayName) {
                this.userProfileEditRequest.emit();
              }
            });
          }

          const sessionDetailsURL = routeUrl.match('^/sessions/[^a-zA-Z]*/.');
          const sessionAnalysisURL = routeUrl.match('^/sessions/[^a-zA-Z]*/analysis');
          if (!sessionDetailsURL) {
            this.isOnSessionPage = true;
          } else if (sessionAnalysisURL) {
            this.isOnSessionAnalysisPage = true;
          }
        }
      });

    this.translateService.get('LOGIN_OPTION_NAV_BTN').subscribe((translatedText) => {
      this.loginOptions = [
        {
          label: translatedText,
          command: () => {
            this.loginWithSecondSAMLProvider();
          },
        },
      ];
    });
  }

  ngOnDestroy(): void {
    this.isAuthSubscription?.unsubscribe();
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

  public onMarkersOverview() {
    this.router.navigate([
      '/markers',
    ]);
  }

  public onSession() {
    this.router.navigate([
      '/sessions/' + this.sessionService.getFocusSession()?.id,
    ]);
  }

  public onAnalysis() {
    this.router.navigate([
      '/sessions/' + this.sessionService.getFocusSession()?.id + '/analysis',
    ]);
  }

  public onSessionInfo() {
    this.router.navigate([
      '/sessions/' + this.sessionService.getFocusSession()?.id + '/info',
    ]);
  }

  public onSessionSettings() {
    this.navigationService.setSessionSettingsSidePanelVisible(true);
  }

  public onSessionAnalysisSettings() {
    this.navigationService.setSessionAnalysisSettingsSidePanelVisible(true);
  }

  public onLanguageSelected(languageCode: LANGUAGE_CODE) {
    this.languageSelector.hide();
    this.languageChange.emit(languageCode);
  }

  public onLogin() {
    window.location.href = environment.samlUrl;
  }

  public loginWithSecondSAMLProvider() {
    window.location.href = environment.samlUrlOption;
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
