import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, map } from 'rxjs';
import { AuthenticateSessionCodeGQL, GetUserGQL, UpdateUserGQL } from '../../../graphql/generated/graphql';
import { SessionsService } from '../../sessions/services/sessions.service';
import { AccessTokenService } from './access-token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticatedSubject = new BehaviorSubject<boolean>(this.accessTokenService.getAccessToken() ? true : false);
  public isAuthenticated$ = this.authenticatedSubject.asObservable();

  constructor(
    private readonly router: Router,
    private readonly authenticateSessionCodeGQL: AuthenticateSessionCodeGQL,
    private readonly meGQL: GetUserGQL,
    private readonly updateMeGQL: UpdateUserGQL,
    private readonly messageService: MessageService,
    private readonly translate: TranslateService,
    private readonly sessionService: SessionsService,
    private readonly accessTokenService: AccessTokenService
  ) {
    this.authenticatedSubject.next(
      this.accessTokenService.isAccessTokenValid(this.accessTokenService.getAccessToken())
    );
  }

  public loginViaSaml(accessToken: string) {
    this.handleLoginSuccess(accessToken);
  }

  public loginViaSessionCode(sessionCode: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.authenticateSessionCodeGQL
        .mutate({
          sessionCode,
        })
        .subscribe({
          next: (result) => {
            if (result.data?.authenticateUserSession.accessToken) {
              this.handleLoginSuccess(result.data?.authenticateUserSession.accessToken);

              this.sessionService.getSessionIdBySessionCode(sessionCode).subscribe({
                next: (sessionId: number) => {
                  if (sessionId) {
                    this.router.navigate([
                      '/sessions/' + sessionId,
                    ]);
                  }
                },
              });

              resolve(true);
            } else {
              //no successful login after all
              this.logout();
              reject(false);
            }
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: this.translate.instant('AUTH.LOGIN.SESSION_CODE_LOGIN_ERROR_MESSAGE'),
            });
          },
        });
    });
  }

  public logout() {
    this.accessTokenService.removeAccessToken();

    this.authenticatedSubject.next(false);

    this.router.navigate([
      'auth',
    ]);
  }

  public me() {
    return this.meGQL.fetch({}, { fetchPolicy: 'no-cache' }).pipe(map((data) => data.data.me));
  }

  public updateUser(displayName: string) {
    return this.updateMeGQL.mutate({
      displayName,
    });
  }

  private handleLoginSuccess(accessToken: string) {
    this.accessTokenService.setAccessToken(accessToken);

    this.authenticatedSubject.next(
      this.accessTokenService.isAccessTokenValid(this.accessTokenService.getAccessToken())
    );
  }
}
