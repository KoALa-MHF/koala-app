import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Session } from './entities/session.entity';
import { isArray } from 'class-validator';

@Injectable()
export class AudioSessionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Session | Session[]> {
    return next.handle().pipe(
      map((data: any) => {
        if (isArray(data)) {
          data.map((session: Session) => {
            session.isAudioSession = !!session.mediaId;
            return session;
          });

          return data;
        } else {
          data.isAudioSession = !!data.mediaId;
          return data;
        }
      })
    );
  }
}
