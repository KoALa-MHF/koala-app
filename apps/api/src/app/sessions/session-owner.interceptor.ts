import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Session } from './entities/session.entity';
import { isArray } from 'class-validator';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class SessionOwnerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Session | Session[]> {
    const ctx = GqlExecutionContext.create(context);
    let user;
    if (ctx.getContext() && ctx.getContext().req) {
      user = ctx.getContext().req.user;
    }

    return next.handle().pipe(
      map((data: any) => {
        if (isArray(data)) {
          data.map((session: Session) => {
            session.isSessionOwner = session.ownerId === user.id;
            return session;
          });

          return data;
        } else {
          data.isSessionOwner = data.ownerId === user.id;
          return data;
        }
      })
    );
  }
}
