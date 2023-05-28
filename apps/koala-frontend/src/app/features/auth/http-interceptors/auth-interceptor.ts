import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccessTokenService } from '../services/access-token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private readonly accessTokenServce: AccessTokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      const accessToken = this.accessTokenServce.getAccessToken();

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
