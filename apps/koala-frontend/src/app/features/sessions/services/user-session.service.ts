import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import {
  CreateUserSessionGQL,
  CreateUserSessionMutation,
  InviteParticipantsGQL,
  RemoveUserSessionGQL,
} from '../../../graphql/generated/graphql';

@Injectable()
export class UserSessionService {
  constructor(
    private readonly createUserSessionGQL: CreateUserSessionGQL,
    private readonly inviteParticipantsGQL: InviteParticipantsGQL,
    private readonly removeUserSessionGQL: RemoveUserSessionGQL
  ) {}

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
}
