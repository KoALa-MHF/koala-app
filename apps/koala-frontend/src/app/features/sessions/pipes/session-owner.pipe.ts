import { Pipe, PipeTransform } from '@angular/core';
import { Session } from '../types/session.entity';

@Pipe({
  name: 'isSessionOwner',
})
export class SessionOwnerPipe implements PipeTransform {
  transform(sessions: Session[], ownerOnly: boolean): Session[] {
    return sessions.filter((session) => session.isSessionOwner === ownerOnly);
  }
}
