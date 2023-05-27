import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreateNewSessionGQL,
  DeleteSessionGQL,
  GetSessionsGQL,
  GetOneSessionGQL,
  GetOneSessionQuery,
  UpdateSessionGQL,
  UpdateSessionInput,
  CreateSessionInput,
  OnSessionUpdatedGQL,
  CreateNewSessionMutation,
  GetOneSessionBySessionCodeGQL,
} from '../../../graphql/generated/graphql';
import { Session } from '../types/session.entity';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  constructor(
    private readonly getSessionGQL: GetSessionsGQL,
    private readonly getOneSessionGQL: GetOneSessionGQL,
    private readonly createSessionGQL: CreateNewSessionGQL,
    private readonly updateSessionGQL: UpdateSessionGQL,
    private readonly deleteSessionGQL: DeleteSessionGQL,
    private readonly onSessionUpdatedGQL: OnSessionUpdatedGQL,
    private readonly getOneSessionBySessionCodeGQL: GetOneSessionBySessionCodeGQL,
    private readonly authService: AuthService
  ) {}

  getAll(): Observable<Session[]> {
    return this.getSessionGQL.fetch({}, { fetchPolicy: 'no-cache' }).pipe(
      map((data) => data.data.sessions),
      map((sessions) =>
        sessions.map((session: Session) => {
          return { ...session, isOwner: this.authService.getLoggedInUserId().toString() === session.owner?.id };
        })
      )
    );
  }

  getOneBySessionCode(code: string) {
    return this.getOneSessionBySessionCodeGQL.fetch({ code }, { fetchPolicy: 'no-cache' });
  }

  getOne(id: number): Observable<Session> {
    return this.getOneSessionGQL
      .fetch(
        {
          sessionId: id,
        },
        { fetchPolicy: 'no-cache' }
      )
      .pipe(
        map((data) => data.data.session),
        map((session) => {
          return { ...session, isOwner: this.authService.getLoggedInUserId().toString() === session.owner?.id };
        })
      );
  }

  create(session: CreateSessionInput) {
    return this.createSessionGQL.mutate({ session });
  }

  update(id: number, session: UpdateSessionInput) {
    return this.updateSessionGQL.mutate({
      id,
      session,
    });
  }

  delete(id: number) {
    return this.deleteSessionGQL.mutate({ id });
  }

  subscribeUpdated(id: number) {
    return this.onSessionUpdatedGQL.subscribe({
      sessionId: id.toString(),
    });
  }

  copySession(sessionId: number): Promise<Session | null> {
    return new Promise<Session | null>((resolve, reject) => {
      this.getOne(sessionId).subscribe({
        next: (session: Session) => {
          this.createSessionGQL
            .mutate({
              session: {
                name: session.name + ' Copy',
                description: session.description,
                displaySampleSolution: session.displaySampleSolution,
                editable: session.editable,
                enableLiveAnalysis: session.enableLiveAnalysis,
                enablePlayer: session.enablePlayer,
                end: session.end,
                start: session.start,
              },
            })
            .subscribe({
              next: (newSessionResult: MutationResult<CreateNewSessionMutation>) => {
                resolve(newSessionResult.data?.createSession || null);
              },
              error: () => {
                reject();
              },
            });
        },
      });
    });
  }
}
