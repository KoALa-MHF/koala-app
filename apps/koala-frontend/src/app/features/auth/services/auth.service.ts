import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticateSessionCodeGQL } from '../../../graphql/generated/graphql';

class KoalaUserStorage {
  isAuthenticated = false;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  storedUser: KoalaUserStorage = new KoalaUserStorage();

  private authenticatedSubject = new BehaviorSubject<boolean>(this.storedUser.isAuthenticated);
  public isAuthenticated$ = this.authenticatedSubject.asObservable();

  constructor(
    private readonly router: Router,
    private readonly authenticateSessionCodeGQL: AuthenticateSessionCodeGQL,
    private readonly messageService: MessageService,
    private readonly translate: TranslateService
  ) {
    const savedUser = localStorage.getItem('koala-user');

    if (savedUser && savedUser !== '{}') {
      this.storedUser = JSON.parse(savedUser);
    }

    this.authenticatedSubject.next(this.storedUser.isAuthenticated);
  }

  public loginViaUsername(username: string, password: string): Observable<boolean> {
    this.storedUser.isAuthenticated = true;
    this.storeUser();

    this.authenticatedSubject.next(this.storedUser.isAuthenticated);

    return this.isAuthenticated$;
  }

  public loginViaSessionCode(sessionCode: string): Observable<boolean> {
    if (sessionCode === 'ABC') {
      this.storedUser.isAuthenticated = true;
      //this.storeUser();

      this.authenticatedSubject.next(this.storedUser.isAuthenticated);
    } else {
      this.authenticateSessionCodeGQL
        .mutate({
          sessionCode,
        })
        .subscribe({
          next: () => {
            this.storedUser.isAuthenticated = true;
            //this.storeUser();

            this.authenticatedSubject.next(this.storedUser.isAuthenticated);
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translate.instant('AUTH.LOGIN.SESSION_CODE_LOGIN_ERROR_MESSAGE'),
            });

            this.storedUser.isAuthenticated = false;
            this.authenticatedSubject.next(this.storedUser.isAuthenticated);
          },
        });
    }

    return this.isAuthenticated$;
  }

  public logout(): Observable<boolean> {
    this.storedUser.isAuthenticated = false;
    localStorage.removeItem('koala-user');

    this.authenticatedSubject.next(this.storedUser.isAuthenticated);

    this.router.navigate([
      'auth',
    ]);

    return this.isAuthenticated$;
  }

  public isAuthenticated() {
    return this.storedUser.isAuthenticated;
  }

  private storeUser() {
    localStorage.setItem('koala-user', JSON.stringify(this.storedUser));
  }
}