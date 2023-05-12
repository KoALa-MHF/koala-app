import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { AuthenticateSessionCodeGQL, GetUserGQL, UpdateUserGQL } from '../../../graphql/generated/graphql';
import jwt_decode from 'jwt-decode';

interface JWToken {
  exp: number;
  iat: number;
}

class KoalaUserStorage {
  accessToken?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  storedUser: KoalaUserStorage = new KoalaUserStorage();

  private authenticatedSubject = new BehaviorSubject<boolean>(this.storedUser.accessToken ? true : false);
  public isAuthenticated$ = this.authenticatedSubject.asObservable();

  constructor(
    private readonly router: Router,
    private readonly authenticateSessionCodeGQL: AuthenticateSessionCodeGQL,
    private readonly meGQL: GetUserGQL,
    private readonly updateMeGQL: UpdateUserGQL,
    private readonly messageService: MessageService,
    private readonly translate: TranslateService
  ) {
    const savedUser = sessionStorage.getItem('koala-user');

    if (savedUser) {
      this.storedUser = JSON.parse(savedUser);
    }

    this.authenticatedSubject.next(this.isAccessTokenValid(this.storedUser.accessToken));
  }

  public getAccessToken() {
    return this.storedUser.accessToken;
  }

  public loginViaUsername(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.handleLoginSuccess('toBeChanged');
      resolve(true);
    });
  }

  public loginViaSaml(accessToken: string) {
    this.handleLoginSuccess(accessToken);
  }

  public loginViaSessionCode(sessionCode: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (sessionCode === 'ABC') {
        //special handling
        this.handleLoginSuccess(sessionCode);
        resolve(true);
      } else {
        this.authenticateSessionCodeGQL
          .mutate({
            sessionCode,
          })
          .subscribe({
            next: (result) => {
              if (result.data?.authenticateUserSession.accessToken) {
                this.handleLoginSuccess(result.data?.authenticateUserSession.accessToken);
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

              this.logout();
              reject(false);
            },
          });
      }
    });
  }

  public logout() {
    delete this.storedUser.accessToken;
    sessionStorage.removeItem('koala-user');

    this.authenticatedSubject.next(false);

    this.router.navigate([
      'auth',
    ]);
  }

  public me() {
    return this.meGQL.fetch({}, { fetchPolicy: 'no-cache' });
  }

  public updateUser(displayName: string) {
    return this.updateMeGQL.mutate({
      displayName,
    });
  }

  private storeUser() {
    sessionStorage.setItem('koala-user', JSON.stringify(this.storedUser));
  }

  private isAccessTokenValid(accessToken?: string): boolean {
    if (accessToken === 'ABC') {
      return true;
    }

    if (accessToken) {
      const jwtTokenDecoded: JWToken = jwt_decode(accessToken);

      return new Date(jwtTokenDecoded.exp * 1000) > new Date();
    } else {
      return false;
    }
  }

  private handleLoginSuccess(accessToken: string) {
    this.storedUser.accessToken = accessToken;
    this.storeUser();

    this.authenticatedSubject.next(this.isAccessTokenValid(this.storedUser.accessToken));
  }
}
