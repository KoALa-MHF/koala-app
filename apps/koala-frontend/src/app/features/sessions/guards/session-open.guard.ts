import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SessionsService } from '../services/sessions.service';
import { SessionStatus } from '../../../graphql/generated/graphql';
import { catchError, map } from 'rxjs';

export const sessionOpenGuard = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const sessionService = inject(SessionsService);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const sessionId = route.paramMap.get('sessionId')!;

  return sessionService.setFocusSession(parseInt(sessionId)).pipe(
    map((session) => {
      if (session.isSessionOwner) {
        return true;
      } else {
        if (session.status === SessionStatus.Open) {
          return true;
        } else {
          return router.navigate([
            '/sessions/not-active',
          ]);
          //return false;
        }
      }
    }),
    catchError((err) => {
      return router.navigate([
        '/sessions/not-found',
      ]);
    })
  );
};
