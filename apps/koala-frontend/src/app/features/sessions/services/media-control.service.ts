import { Injectable } from '@angular/core';
import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from 'wavesurfer.js/src/plugin/timeline';
import { WaveSurferParams } from 'wavesurfer.js/types/params';
import { EventHandler } from 'wavesurfer.js/types/util';

export enum MediaActions {
  Play = 1,
  Stop,
  SkipForward,
  SkipBackward,
  VolumeChange,
}

export type MediaEvent = {
  actions: MediaActions;
  value: any;
};

@Injectable({
  providedIn: 'root',
})
export class MediaControlService {
  wsOptions: WaveSurferParams;
  wavesurferOptions: WaveSurferParams;
  private wave: WaveSurfer;
  uuid: string | HTMLElement;

  waves = new Map<string | HTMLElement, WaveSurfer>();

  constructor() {}

  load(trackurl: string, uuid: string) {
    this.uuid = uuid;
    return new Promise((resolve, reject) => {
      this.wsOptions = {
        container: `#${this.uuid}`,
        backgroundColor: 'transparent',
        cursorColor: 'rgba(73,157,255,.95)',
        cursorWidth: 2,
        progressColor: 'rgba(0,0,0,.9)',
        waveColor: 'rgba(73,157,158,1)',
        autoCenter: true,
        normalize: true,
        scrollParent: false,
        backend: 'WebAudio',
        responsive: true,
        maxCanvasWidth: 100,
        hideScrollbar: false,
        height: 200,
        closeAudioContext: true,
      };
      this.waves.set(
        this.uuid,
        WaveSurfer.create({
          ...this.wsOptions,
          plugins: [
            TimelinePlugin.create({
              container: `#${this.uuid}-timeline`,
            }),
          ],
          //...wavesurferOptions
        })
      );
      const w = this.waves.get(this.uuid);
      if (w !== undefined) {
        w.on('ready', function () {
          resolve('');
        });
        w.load(trackurl);
      }
    });
  }

  private getWave(): WaveSurfer {
    const w = this.waves.get(this.uuid);
    if (w == undefined) {
      throw Error('no wavesurfer instance');
    }
    return w;
  }

  public play() {
    try {
      const w = this.getWave();
      if (!w.isPlaying()) {
        w.play();
      } else {
        w?.pause();
      }
    } catch (error) {
      console.error(error);
    }
  }

  public stop() {
    try {
      const w = this.getWave();
      w.stop();
    } catch (error) {
      console.error(error);
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

  public onVolumeChange(volume: number) {
    try {
      const w = this.getWave();
      w.setVolume(volume);
    } catch (error) {
      console.error(error);
    }
  }
}
