import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import {
  CreateUserSessionGQL,
  CreateUserSessionMutation,
  InviteParticipantsGQL,
  RemoveUserSessionGQL,
} from '../../../graphql/generated/graphql';
import { SessionsService } from './sessions.service';
import { AuthService } from '../../auth/services/auth.service';
import { Session } from '../types/session.entity';

@Injectable()
export class UserSessionService {
  userID = 0;

  constructor(
    private readonly createUserSessionGQL: CreateUserSessionGQL,
    private readonly inviteParticipantsGQL: InviteParticipantsGQL,
    private readonly removeUserSessionGQL: RemoveUserSessionGQL,
    private readonly sessionService: SessionsService,
    private readonly authService: AuthService
  ) {
    this.authService.me().subscribe({
      next: (data) => {
        this.userID = parseInt(data.id);
      },
    });
  }

  addParticipantToSession(sessionId: number, email: string): Observable<MutationResult<CreateUserSessionMutation>> {
    return this.createUserSessionGQL.mutate({
      sessionId,
      email,
    });
  }

  inviteParticpants(userSessionIds: string[], invitationMessage: string) {
    return this.inviteParticipantsGQL.mutate({
      userSessionIds,
      message: invitationMessage,
    });
  }

  removeParticipantFromSession(userSessionId: number) {
    return this.removeUserSessionGQL.mutate({
      userSessionId,
    });
  }

  getOwnUserSession(session: Session) {
    return session.userSessions?.filter((userSession) => userSession.owner?.id === this.userID.toString())[0];
  }

  getOwnUserSessionFromFocusSession() {
    const focusSession = this.sessionService.getFocusSession();

    if (focusSession) {
      return this.getOwnUserSession(focusSession);
    } else {
      return null;
    }
  }
}
