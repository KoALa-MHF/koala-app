import { Injectable } from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline';
import MediaSessionPlugin from 'wavesurfer.js/src/plugin/mediasession';
import { WaveSurferParams } from 'wavesurfer.js/types/params';
import { EventHandler } from 'wavesurfer.js/types/util';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import MP3Tag from 'mp3tag.js';
import { Subject } from 'rxjs';

export enum MediaActions {
  Play = 1,
  Stop,
  SkipForward,
  SkipBackward,
  VolumeChange,
  Mute,
  Ready,
}

export interface MediaEvent {
  actions: MediaActions;
  value?: number;
}

@Injectable()
export class MediaControlService {
  uuid!: string | HTMLElement;
  defaultOptions: WaveSurferParams = {
    container: `#${this.uuid}`,
    backgroundColor: 'transparent',
    cursorColor: 'rgba(73,157,255,.95)',
    cursorWidth: 2,
    progressColor: 'rgba(0,0,0,.9)',
    waveColor: 'rgba(73,157,158,1)',
    autoCenter: true,
    normalize: true,
    scrollParent: false,
    backend: 'MediaElementWebAudio',
    responsive: true,
    maxCanvasWidth: 100,
    hideScrollbar: false,
    height: 100,
    closeAudioContext: true,
  };
  waves = new Map<string | HTMLElement, WaveSurfer>();

  private mediaPlayStateChangedSubject = new Subject<MediaActions>();
  public mediaPlayStateChanged$ = this.mediaPlayStateChangedSubject.asObservable();

  async load(trackurl: string, uuid: string) {
    this.uuid = uuid;
    let plugin: any = undefined;
    let audioBlob: Blob = new Blob();

    try {
      audioBlob = await this.fetchAudioBlob(trackurl);
      plugin = await this.createMediaSessionPlugin(audioBlob);
    } catch (e) {
      throw new Error('error fetching audio file');
    }
    this.defaultOptions.container = `#${this.uuid}`;
    this.waves.set(
      this.uuid,
      WaveSurfer.create({
        ...this.defaultOptions,
        plugins: [
          TimelinePlugin.create({
            container: `#${this.uuid}-timeline`,
          }),
          plugin,
        ],
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
        this.mediaPlayStateChangedSubject.next(MediaActions.Ready);
      });

      const audio = new Audio();
      audio.src = URL.createObjectURL(audioBlob);
      w.load(audio);
    } catch (e) {
      throw new Error('cannot load audio wave');
    }
  }

  private async createMediaSessionPlugin(blob: Blob): Promise<any> {
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
          MediaSessionPlugin.create({
            metadata: {
              album: mp3tag.tags.album,
              artist: mp3tag.tags.artist,
              title: mp3tag.tags.title,
              artwork: [],
            },
          })
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
    const w = this.getWave();
    return w.mediasession.metadata;
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
        w.skipBackward(1);
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
        w.skipForward(1);
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
      w.setMute(!!mute);
    } catch (error) {
      console.error(error);
      throw new Error(`cannot mute/unmute audio file: ${error}`);
    }
  }

  public addEventHandler(eventName: string, handler: EventHandler) {
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
}
