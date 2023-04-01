import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve) => {
      this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
        if (isAuthenticated === true) {
          resolve(true);
        } else {
          //reject throws an erro
          //to block navigation, canActivate should resolve false
          resolve(false);

          this.router.navigate([
            'auth',
          ]);
        }
      });
    });
  }
}
