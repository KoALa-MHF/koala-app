import { Injectable } from '@angular/core';
import { MutationResult } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
  SetPlayModeGQL,
  SetPlayPositionGQL,
  SetPlayModeInput,
  ToolbarMarker,
} from '../../../graphql/generated/graphql';
import { Session } from '../types/session.entity';
import { AccessTokenService } from '../../auth/services/access-token.service';
import { ToolbarsService } from './toolbars.service';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private focusSession?: Session;

  private focusSessionSubject = new Subject<Session>();
  public focusSessionChanged$ = this.focusSessionSubject.asObservable();

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
    private readonly accessTokenService: AccessTokenService,
    private readonly toolbarService: ToolbarsService
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

  subscribeUpdated(id: number) {
    return this.onSessionUpdatedGQL
      .subscribe({
        sessionId: id.toString(),
      })
      .pipe(
        map((response) => {
          const session = response.data?.sessionUpdated;
          if (session) {
            return this.addIsOwner(this.addIsAudioSession(session));
          } else {
            throw new Error('Session Response Empty After SessionUpdate');
          }
        }),
        map((session: Session) => {
          if (this.focusSession && this.focusSession.id === session.id) {
            //take over owner and isAudio information
            session.isSessionOwner = this.focusSession.isSessionOwner;
            session.owner = this.focusSession.owner;
            session.media = this.focusSession.media;
            session = this.addIsAudioSession(session);
          }

          return session;
        })
      )
      .subscribe({
        next: (session?: Session) => {
          this.focusSession = session;
          if (this.focusSession) {
            this.focusSessionSubject.next(this.focusSession);
          }
        },
      });
  }

  copySession(sessionId: number): Promise<Session | null> {
    let sourceMarkers: ToolbarMarker[] | null | undefined;
    return new Promise<Session | null>((resolve, reject) => {
      this.getOne(sessionId).subscribe({
        next: (session: Session) => {
          if (session.toolbars) {
            sourceMarkers = session.toolbars[0].markers;
          }

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
                const newToolbar = newSessionResult.data?.createSession.toolbars[0];

                if (newToolbar && sourceMarkers) {
                  this.toolbarService
                    .update(parseInt(newToolbar.id), {
                      markers: sourceMarkers.map((marker) => marker.markerId),
                    })
                    .subscribe(() => {
                      resolve(newSessionResult.data?.createSession || null);
                    });
                } else {
                  resolve(newSessionResult.data?.createSession || null);
                }
              },
              error: () => {
                reject();
              },
            });
        },
      });
    });
  }

  setPlayMode(sessionId: number, playModeInput: SetPlayModeInput) {
    return this.setPlayModeGQL.mutate({ sessionId, setPlayModeInput: playModeInput }).pipe(
      map((response) => {
        const session = response.data?.setPlayMode;
        if (session) {
          return this.addIsOwner(session);
        } else {
          throw new Error('Session Response Empty After SetPlayMode');
        }
      }),
      map((session) => this.addIsAudioSession(session))
    );
  }

  setPlayPosition(sessionId: number, playPosition: number) {
    return this.setPlayPositionGQL.mutate({ sessionId, setPlayPositionInput: { playPosition } }).pipe(
      map((response) => {
        const session = response.data?.setPlayPosition;
        if (session) {
          return this.addIsOwner(session);
        } else {
          throw new Error('Session Response Empty After SetPlayPosition');
        }
      }),
      map((session) => this.addIsAudioSession(session))
    );
  }

  setFocusSession(sessionId: number) {
    return this.getOne(sessionId).pipe(
      tap((session: Session) => {
        this.focusSession = session;
        this.focusSessionSubject.next(this.focusSession);
      })
    );
  }

  getFocusSession(): Session | undefined {
    return this.focusSession;
  }

  private addIsOwner(session: Session): Session {
    return { ...session, isSessionOwner: this.accessTokenService.getLoggedInUserId().toString() === session.owner?.id };
  }

  private addIsAudioSession(session: Session): Session {
    return { ...session, isAudioSession: !!session.media?.id };
  }
}
