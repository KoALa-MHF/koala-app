import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      const authService = this.injector.get(AuthService);
      const accessToken = authService?.getAccessToken();

      if (accessToken) {
        return next.handle(
          req.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}` },
          })
        );
      } else {
        return next.handle(req);
      }
    } catch {
      // log without translation translation service is not yet available
      return next.handle(req);
    }
  }
}
