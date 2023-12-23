import { Pipe, PipeTransform } from '@angular/core';
import { Session } from '../types/session.entity';
import { SessionStatus } from '../../../graphql/generated/graphql';

@Pipe({
  name: 'sessionStatus',
})
export class SessionStatusPipe implements PipeTransform {
  transform(sessions: Session[], status: SessionStatus[]): Session[] {
    if (status.length === 0) {
      return sessions;
    } else {
      return sessions.filter((session) => {
        if (session.status) {
          return status.includes(session.status);
        } else {
          return false;
        }
      });
    }
  }
}
