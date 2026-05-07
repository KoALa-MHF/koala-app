import { ElementRef, Injectable } from '@angular/core';
import { WaveSurferEvents } from 'wavesurfer.js';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import { EventHandler } from 'wavesurfer.js/types/util';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MP3Tag from 'mp3tag.js';
import { Subject } from 'rxjs';
import { SessionsService } from './sessions.service';
import { AccessTokenService } from '../../auth/services/access-token.service';
import { SwitchTubeWaveSurferMock } from './switchtube-wavesurfer.mock';

export enum MediaActions {
  Play = 1,
  Stop,
  Mute,
  Ready,
  Finish,
  Seeking,
}

export interface MediaEvent {
  actions: MediaActions;
  value?: number;
}

@Injectable({
  providedIn: 'root',
})
export class MediaControlService {
  uuid!: string | HTMLElement;
  private waves = new Map<string | HTMLElement, WaveSurfer | SwitchTubeWaveSurferMock>();

  private lastPlayPositionUpdate = -1;

  private mediaPlayStateChangedSubject = new Subject<MediaActions>();
  public mediaPlayStateChanged$ = this.mediaPlayStateChangedSubject.asObservable();

  constructor(
    private readonly sessionService: SessionsService,
    private readonly accessTokenService: AccessTokenService
  ) {}

  async load(trackurl: string, uuid: string) {
    this.uuid = uuid;
    let mediaBlob: Blob = new Blob();

    try {
      mediaBlob = await this.fetchMediaBlob(trackurl);
    } catch (e) {
      throw new Error('error fetching media file');
    }

    let mediaElement;
    let mediaIFrame: HTMLIFrameElement;
    const media = this.sessionService.getFocusSession()?.media;

    if (this.sessionService.getFocusSession()?.isVideoSession) {
      if (media?.name.includes('embed')) {
        mediaIFrame = document.createElement('iframe');
        mediaIFrame.width = '640';
        mediaIFrame.height = '360';
        mediaIFrame.src = media?.name || '';
        mediaIFrame.frameBorder = '0';
        mediaIFrame.allow = 'autoplay; fullscreen';

        document.getElementById('sessionVideo')?.appendChild(mediaIFrame);
      } else {
        mediaElement = document.createElement('video');
        document.getElementById('sessionVideo')?.appendChild(mediaElement);
        mediaElement.src = URL.createObjectURL(mediaBlob);
      }
    } else {
      mediaElement = new Audio();
      mediaElement.src = URL.createObjectURL(mediaBlob);
    }

    this.createMediadata(mediaBlob);

    this.waves.set(
      this.uuid,
      media?.name.includes('embed')
        ? new SwitchTubeWaveSurferMock(mediaIFrame!)
        : WaveSurfer.create({
            container: `#${this.uuid}`,
            cursorColor: 'rgba(73,157,255,.95)',
            cursorWidth: 2,
            progressColor: 'rgba(0,0,0,.9)',
            waveColor: 'rgba(73,157,158,1)',
            autoCenter: true,
            normalize: true,
            hideScrollbar: false,
            height: 100,
            media: mediaElement,
            plugins: [],
          })
    );

    try {
      const w = this.getWave();

      this.addEventHandler('pause', () => {
        this.mediaPlayStateChangedSubject.next(MediaActions.Stop);
      });
      this.addEventHandler('play', () => {
        this.mediaPlayStateChangedSubject.next(MediaActions.Play);
      });
      this.addEventHandler('finish', () => {
        this.mediaPlayStateChangedSubject.next(MediaActions.Finish);
      });
      this.addEventHandler('seeking', () => {
        this.mediaPlayStateChangedSubject.next(MediaActions.Seeking);
      });
      this.addEventHandler('ready', () => {
        this.createTimelinePlugin();
        this.mediaPlayStateChangedSubject.next(MediaActions.Ready);
      });
      this.addEventHandler('audioprocess', (currentTime) => {
        if (this.sessionService.getFocusSession()?.isSessionOwner) {
          if (
            //only send every 5s for syncing reasons => clients play on their own in that timeframe
            this.lastPlayPositionUpdate !== this.sessionService.getFocusSession()?.playPosition &&
            Math.round((this.sessionService.getFocusSession()?.playPosition || 0) * 1000 + 5000) <
              Math.round(currentTime * 1000)
          ) {
            this.sessionService
              .setPlayPosition(parseInt(this.sessionService.getFocusSession()?.id || '0'), currentTime)
              .subscribe({
                error: () => (this.lastPlayPositionUpdate = -1),
              });

            this.lastPlayPositionUpdate = this.sessionService.getFocusSession()?.playPosition || 0;
          }
        }
      });

      this.addEventHandler('seeking', (newTime) => {
        if (this.sessionService.getFocusSession()?.isSessionOwner) {
          this.sessionService
            .setPlayPosition(parseInt(this.sessionService.getFocusSession()?.id || '0'), newTime)
            .subscribe();
        }
      });
    } catch (e) {
      throw new Error('cannot load audio wave');
    }
  }

  setPosition(positionInSeconds: number) {
    try {
      this.getWave().setTime(positionInSeconds);
    } catch {
      console.log('error setting media time position');
    }
  }

  private async createMediadata(blob: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = function () {
        const buff = this.result as ArrayBufferLike;
        const mp3tag = new MP3Tag(buff);
        mp3tag.read();
        if (mp3tag.error !== '') {
          reject('');
        }
        resolve(
          (navigator.mediaSession.metadata = new MediaMetadata({
            album: mp3tag.tags.album,
            artist: mp3tag.tags.artist,
            title: mp3tag.tags.title,
            artwork: [],
          }))
        );
      };
      reader.readAsArrayBuffer(blob);
    });
  }

  private async fetchMediaBlob(url: string) {
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.accessTokenService.getAccessToken()}`,
      },
    });
    return resp.blob();
  }

  private getWave(): WaveSurfer | SwitchTubeWaveSurferMock {
    const w = this.waves.get(this.uuid);
    if (w == undefined) {
      throw Error('no wavesurfer instance');
    }
    return w;
  }

  public getMetadata() {
    return navigator.mediaSession.metadata;
  }

  public getDuration() {
    const w = this.getWave();
    return w.getDuration();
  }

  public getCurrentTime() {
    const w = this.getWave();
    return w.getCurrentTime();
  }

  public togglePlay() {
    try {
      const w = this.getWave();
      if (!w.isPlaying()) {
        w.play();
        this.mediaPlayStateChangedSubject.next(MediaActions.Play);
      } else {
        w?.pause();
        this.mediaPlayStateChangedSubject.next(MediaActions.Stop);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`cannot play/pause audio file: ${error}`);
    }
  }

  public stop() {
    try {
      const w = this.getWave();
      w.stop();
    } catch (error) {
      console.error(error);
      throw new Error(`cannot stop audio file: ${error}`);
    }
  }

  public skipBackward() {
    try {
      const w = this.getWave();
      if (w.isPlaying()) {
        w.seekTo(1);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`cannot skip backward audio file: ${error}`);
    }
  }

  public skipForward() {
    try {
      const w = this.getWave();
      if (w.isPlaying()) {
        w.seekTo(1);
      }
    } catch (error) {
      console.error(error);
      throw new Error(`cannot skip forward audio file: ${error}`);
    }
  }

  public onVolumeChange(volume: number) {
    try {
      const w = this.getWave();
      w.setVolume(volume * 0.01);
    } catch (error) {
      console.error(error);
      throw new Error(`cannot change volume for audio file: ${error}`);
    }
  }

  public onMute(mute: number) {
    try {
      const w = this.getWave();
      w.setMuted(!!mute);
    } catch (error) {
      console.error(error);
      throw new Error(`cannot mute/unmute audio file: ${error}`);
    }
  }

  public setInteraction(enabled: boolean) {
    const wavesurfer = this.getWave();
    wavesurfer.setOptions({
      interact: enabled,
    });
  }

  public addEventHandler(eventName: keyof WaveSurferEvents, handler: EventHandler) {
    try {
      const w = this.getWave();
      return w.on(eventName, handler);
    } catch (error) {
      console.error(error);
    }
    return;
  }

  public destroy() {
    try {
      const w = this.getWave();
      w.unAll();
      w.destroy();
    } catch (error) {
      console.error(error);
    }
  }

  private createTimelinePlugin() {
    const timelineContainer = document.getElementById(`${this.uuid}-timeline`)!;
    const w = this.getWave();
    let interval = 5;
    const ratio = timelineContainer.getBoundingClientRect().width / (w.getDuration() / 10);
    if (ratio < 30) {
      interval = 20;
    }
    const pl = TimelinePlugin.create({
      container: timelineContainer,
      timeInterval: interval,
      secondaryLabelInterval: interval * 2,
      primaryLabelInterval: interval * 2,
      formatTimeCallback: (sec: number) => {
        const minutes = Math.floor(sec / 60);
        const seconds = sec % 60;
        let secondsLabel;

        if (seconds < 10) {
          secondsLabel = '0' + seconds;
        } else {
          secondsLabel = seconds.toString();
        }
        return minutes + ':' + secondsLabel;
      },
    });
    w.registerPlugin(pl);
    // force rerender
    w.zoom(0);
  }
}
