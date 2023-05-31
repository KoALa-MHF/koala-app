import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreateNewSessionGQL,
  DeleteSessionGQL,
  GetSessionsGQL,
  GetOneSessionGQL,
  UpdateSessionGQL,
  UpdateSessionInput,
  CreateSessionInput,
  OnSessionUpdatedGQL,
  CreateNewSessionMutation,
  GetOneSessionBySessionCodeGQL,
  PlayMode,
  SetPlayModeGQL,
  SetPlayPositionGQL,
} from '../../../graphql/generated/graphql';
import { Session } from '../types/session.entity';
import { AccessTokenService } from '../../auth/services/access-token.service';

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
    private readonly setPlayModeGQL: SetPlayModeGQL,
    private readonly setPlayPositionGQL: SetPlayPositionGQL,
    private readonly accessTokenService: AccessTokenService
  ) {}

  getAll(): Observable<Session[]> {
    return this.getSessionGQL.fetch({}, { fetchPolicy: 'no-cache' }).pipe(
      map((data) => data.data.sessions),
      map((sessions) => sessions.map((session) => this.addIsOwner(session))),
      map((sessions) => sessions.map((session) => this.addIsAudioSession(session)))
    );
  }

  getSessionIdBySessionCode(code: string): Observable<number> {
    return this.getOneSessionBySessionCodeGQL
      .fetch({ code }, { fetchPolicy: 'no-cache' })
      .pipe(map((response) => parseInt(response.data.sessionByCode.id)));
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
        map((session) => this.addIsOwner(session)),
        map((session) => this.addIsAudioSession(session))
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

  subscribeUpdated(id: number): Observable<Session | undefined> {
    return this.onSessionUpdatedGQL
      .subscribe({
        sessionId: id.toString(),
      })
      .pipe(
        map((response) => response.data?.sessionUpdated),
        map((session?: Session) => {
          if (session) {
            session = this.addIsAudioSession(session);
            return this.addIsOwner(session);
          } else {
            return session;
          }
        })
      );
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

  setPlayMode(sessionId: number, playMode: PlayMode) {
    return this.setPlayModeGQL.mutate({ sessionId, setPlayModeInput: { playMode } });
  }

  setPlayPosition(sessionId: number, playPosition: number) {
    return this.setPlayPositionGQL.mutate({ sessionId, setPlayPositionInput: { playPosition } });
  }

  private addIsOwner(session: Session) {
    return { ...session, isOwner: this.accessTokenService.getLoggedInUserId().toString() === session.owner?.id };
  }

  private addIsAudioSession(session: Session): Session {
    return { ...session, isAudioSession: !!session.media?.id };
  }
}
