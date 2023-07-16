import { Injectable } from '@angular/core';
import { WaveSurfer, WaveSurferEvents } from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import { EventHandler } from 'wavesurfer.js/types/util';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MP3Tag from 'mp3tag.js';
import { Subject } from 'rxjs';
import { SessionsService } from './sessions.service';

export enum MediaActions {
  Play = 1,
  Stop,
  Mute,
  Ready,
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
  private waves = new Map<string | HTMLElement, WaveSurfer>();

  private mediaPlayStateChangedSubject = new Subject<MediaActions>();
  public mediaPlayStateChanged$ = this.mediaPlayStateChangedSubject.asObservable();

  constructor(private readonly sessionService: SessionsService) {}

  async load(trackurl: string, uuid: string) {
    this.uuid = uuid;
    let audioBlob: Blob = new Blob();

    try {
      audioBlob = await this.fetchAudioBlob(trackurl);
    } catch (e) {
      throw new Error('error fetching audio file');
    }
    const audio = new Audio();
    audio.src = URL.createObjectURL(audioBlob);
    const timelineContainer = document.getElementById(`${this.uuid}-timeline`)!;
    this.createMediadata(audioBlob);
    this.waves.set(
      this.uuid,
      WaveSurfer.create({
        container: `#${this.uuid}`,
        cursorColor: 'rgba(73,157,255,.95)',
        cursorWidth: 2,
        progressColor: 'rgba(0,0,0,.9)',
        waveColor: 'rgba(73,157,158,1)',
        autoCenter: true,
        normalize: true,
        hideScrollbar: false,
        height: 100,
        media: audio,
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
      this.addEventHandler('ready', () => {
        this.createTimelinePlugin();
        this.mediaPlayStateChangedSubject.next(MediaActions.Ready);
      });
      this.addEventHandler('audioprocess', (currentTime) => {
        if (this.sessionService.getFocusSession()?.isSessionOwner) {
          if (
            Math.round((this.sessionService.getFocusSession()?.playPosition || 0) * 10) + 3 <
            Math.round(currentTime * 10)
          ) {
            this.sessionService
              .setPlayPosition(parseInt(this.sessionService.getFocusSession()?.id || '0'), currentTime)
              .subscribe();
          }
        }
      });

      this.addEventHandler('seeking', (newTime) => {
        if (this.sessionService.getFocusSession()?.isSessionOwner) {
          this.sessionService
            .setPlayPosition(parseInt(this.sessionService.getFocusSession()?.id || '0'), w.getDuration() * newTime)
            .subscribe(() => {
              console.log('Success');
            });
        }
      });
    } catch (e) {
      throw new Error('cannot load audio wave');
    }
  }

  setPosition(positionInSeconds: number) {
    try {
      this.getWave().setTime(positionInSeconds);
    } catch {}
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

  private async fetchAudioBlob(url: string) {
    const resp = await fetch(url);
    return resp.blob();
  }

  private getWave(): WaveSurfer {
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
