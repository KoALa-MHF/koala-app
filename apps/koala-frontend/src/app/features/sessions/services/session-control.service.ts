import { Injectable, OnDestroy } from '@angular/core';
import { SessionsService } from './sessions.service';
import { PlayMode } from '../../../graphql/generated/graphql';
import { Session } from '../types/session.entity';
import { MediaControlService } from './media-control.service';
import { Observable, Subject, Subscription, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionControlService implements OnDestroy {
  private session?: Session;
  private clientSessionStartTime?: number;
  private offset = 0;
  private focusSessionChangeSubscription: Subscription;

  private playModeChangedSubject = new Subject<PlayMode>();
  public playModeChanged$ = this.playModeChangedSubject.asObservable();

  constructor(
    private readonly sessionService: SessionsService,
    private readonly mediaControlService: MediaControlService
  ) {
    this.focusSessionChangeSubscription = this.sessionService.focusSessionChanged$.subscribe({
      next: (session: Session) => {
        this.updateSessionData(session);
      },
    });
  }

  startSession(): Observable<Session> {
    if (this.session?.isAudioSession) {
      this.mediaControlService.togglePlay();
    }

    return this.sessionService
      .setPlayMode(parseInt(this.session?.id || '0'), {
        playMode: PlayMode.Running,
      })
      .pipe(tap((session: Session) => this.updateSessionData(session)));
  }

  pauseSession(): Observable<Session> {
    if (this.session?.isAudioSession) {
      this.mediaControlService.togglePlay();
    }

    return this.sessionService
      .setPlayMode(parseInt(this.session?.id || '0'), {
        playMode: PlayMode.Paused,
      })
      .pipe(tap((session: Session) => this.updateSessionData(session)));
  }

  stopSession(): Observable<Session> {
    if (this.session?.isAudioSession) {
      this.mediaControlService.stop();
    }

    return this.sessionService
      .setPlayMode(parseInt(this.session?.id || '0'), {
        playMode: PlayMode.Paused,
      })
      .pipe(tap((session: Session) => this.updateSessionData(session)));
  }

  getDuration(): number {
    if (this.session?.isAudioSession) {
      return this.mediaControlService.getDuration();
    } else {
      if (this.session && this.session.liveSessionStart && this.session.liveSessionEnd) {
        return (
          (new Date(this.session.liveSessionEnd).valueOf() - new Date(this.session.liveSessionStart).valueOf()) / 1000
        );
      } else {
        //no duration calculation possible at the moment
        return 0;
      }
    }
  }

  getCurrentTime(): number {
    if (this.session?.isAudioSession) {
      return this.mediaControlService.getCurrentTime() * 1000000;
    } else {
      return Date.now() - ((this.clientSessionStartTime?.valueOf() || 0) - this.offset);
    }
  }

  ngOnDestroy(): void {
    this.focusSessionChangeSubscription.unsubscribe();
  }

  private updateSessionData(session: Session) {
    let playModeChanged = false;

    if (this.session?.playMode !== session.playMode) {
      playModeChanged = true;
    }
    this.session = session;

    if (this.session.liveSessionStart && this.session.playMode === PlayMode.Running) {
      this.clientSessionStartTime = Date.now();
      if (this.session.currentSessionServerTime) {
        this.offset = this.session.currentSessionServerTime - this.session.liveSessionStart;
      } else {
        this.offset = 0;
      }
    }

    if (playModeChanged) {
      this.playModeChangedSubject.next(this.session.playMode || PlayMode.Paused);
    }
  }
}
