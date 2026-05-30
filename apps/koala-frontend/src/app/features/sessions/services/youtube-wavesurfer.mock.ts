import type { GenericPlugin } from 'wavesurfer.js/dist/base-plugin.js';

type Handler = (...args: unknown[]) => void;

// YouTube IFrame API player states.
// https://developers.google.com/youtube/iframe_api_reference#Playback_status
const YT_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

interface YouTubeInfo {
  currentTime?: number;
  duration?: number;
  playerState?: number;
  volume?: number;
  muted?: boolean;
}

interface YouTubeIncoming {
  event?: string;
  info?: unknown;
  id?: string;
  channel?: string;
}

// The iframe URL must include `enablejsapi=1` for the YouTube player to
// accept postMessage commands from this parent window.
export class YouTubeWaveSurferMock {
  private readonly iframe: HTMLIFrameElement;
  private readonly targetOrigin: string;
  private readonly id: string;
  private readonly handlers = new Map<string, Set<Handler>>();
  private readonly onWindowMessage: (event: MessageEvent) => void;

  private duration = 0;
  private currentTime = 0;
  private playing = false;
  private interact = true;
  private volume = 1;
  private muted = false;
  private destroyed = false;
  private readyEmitted = false;

  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.targetOrigin = resolveOrigin(iframe);
    this.id = `koala-yt-${Math.random().toString(36).slice(2, 10)}`;
    this.onWindowMessage = (event) => this.handleIncoming(event);
    window.addEventListener('message', this.onWindowMessage);
    this.bootstrap();
  }

  // ---- wavesurfer-compatible API --------------------------------------------

  on(event: string, handler: Handler): () => void {
    let bucket = this.handlers.get(event);
    if (!bucket) {
      bucket = new Set();
      this.handlers.set(event, bucket);
    }
    bucket.add(handler);
    return () => bucket!.delete(handler);
  }

  unAll(): void {
    this.handlers.clear();
  }

  play(): Promise<void> {
    this.command('playVideo');
    return Promise.resolve();
  }

  pause(): void {
    this.command('pauseVideo');
  }

  stop(): void {
    this.command('stopVideo');
  }

  isPlaying(): boolean {
    return this.playing;
  }

  getDuration(): number {
    return this.duration;
  }

  getCurrentTime(): number {
    return this.currentTime;
  }

  seekTo(progress: number): void {
    const target = (this.duration || 0) * Math.max(0, Math.min(1, progress));
    this.setTime(target);
  }

  setTime(seconds: number): void {
    this.command('seekTo', [
      seconds,
      true,
    ]);
    this.currentTime = seconds;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.command('setVolume', [
      Math.round(this.volume * 100),
    ]);
  }

  getVolume(): number {
    return this.volume;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.command(muted ? 'mute' : 'unMute');
  }

  getMuted(): boolean {
    return this.muted;
  }

  setOptions(options: { interact?: boolean }): void {
    if (typeof options.interact === 'boolean') {
      this.interact = options.interact;
      this.iframe.style.pointerEvents = options.interact ? '' : 'none';
    }
  }

  registerPlugin<T extends GenericPlugin>(plugin: T): T {
    // Plugins (e.g. timeline) are not backed by YouTube — accept and ignore.
    return plugin;
  }

  zoom(_level: number): void {
    // No-op: the YouTube iframe renders its own UI.
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    window.removeEventListener('message', this.onWindowMessage);
    this.handlers.clear();
  }

  // ---- internals ------------------------------------------------------------

  private bootstrap(): void {
    const start = () => {
      if (this.destroyed) return;
      // Registers this window as a listener; YouTube starts sending
      // initialDelivery + periodic infoDelivery messages back.
      this.post({ event: 'listening', id: this.id, channel: 'widget' });
      this.command('addEventListener', [
        'onReady',
      ]);
      this.command('addEventListener', [
        'onStateChange',
      ]);
    };

    if (this.isIframeLoaded()) {
      start();
    } else {
      this.iframe.addEventListener('load', start, { once: true });
    }
  }

  private isIframeLoaded(): boolean {
    // Cross-origin: contentDocument access throws or returns null after the
    // iframe has navigated to its cross-origin src — treat that as loaded.
    try {
      return this.iframe.contentDocument === null;
    } catch {
      return true;
    }
  }

  private command(func: string, args: unknown[] = []): void {
    this.post({ event: 'command', func, args, id: this.id, channel: 'widget' });
  }

  private post(message: object): void {
    const target = this.iframe.contentWindow;
    if (!target) return;
    target.postMessage(JSON.stringify(message), this.targetOrigin);
  }

  private handleIncoming(event: MessageEvent): void {
    if (event.source !== this.iframe.contentWindow) return;

    let data: YouTubeIncoming;
    try {
      data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    } catch {
      return;
    }
    if (!data || typeof data !== 'object') return;
    if (data.id && data.id !== this.id) return;

    switch (data.event) {
      case 'onReady':
      case 'initialDelivery':
        this.applyInfo(data.info as YouTubeInfo | undefined);
        if (!this.readyEmitted) {
          this.readyEmitted = true;
          this.emit('ready', this.duration);
        }
        break;
      case 'infoDelivery':
        this.applyInfo(data.info as YouTubeInfo | undefined);
        break;
      case 'onStateChange':
        if (typeof data.info === 'number') this.applyState(data.info);
        break;
    }
  }

  private applyInfo(info: YouTubeInfo | undefined): void {
    if (!info) return;

    if (typeof info.duration === 'number' && info.duration > 0) {
      this.duration = info.duration;
    }
    if (typeof info.volume === 'number') {
      this.volume = info.volume / 100;
    }
    if (typeof info.muted === 'boolean') {
      this.muted = info.muted;
    }
    if (typeof info.currentTime === 'number') {
      const prev = this.currentTime;
      this.currentTime = info.currentTime;
      if (this.playing && info.currentTime !== prev) {
        this.emit('audioprocess', info.currentTime);
      }
    }
    if (typeof info.playerState === 'number') {
      this.applyState(info.playerState);
    }
  }

  private applyState(state: number): void {
    const wasPlaying = this.playing;
    if (state === YT_STATE.PLAYING) {
      this.playing = true;
      if (!wasPlaying) this.emit('play');
    } else if (state === YT_STATE.PAUSED) {
      this.playing = false;
      if (wasPlaying) this.emit('pause');
    } else if (state === YT_STATE.ENDED) {
      this.playing = false;
      this.emit('finish');
    }
  }

  private emit(event: string, ...args: unknown[]): void {
    const bucket = this.handlers.get(event);
    if (!bucket) return;
    for (const handler of bucket) {
      try {
        handler(...args);
      } catch (err) {
        console.error(`[YouTubeWaveSurferMock] handler for "${event}" threw`, err);
      }
    }
  }
}

function resolveOrigin(iframe: HTMLIFrameElement): string {
  const src = iframe.getAttribute('src');
  if (!src) return '*';
  try {
    return new URL(src, window.location.href).origin;
  } catch {
    return '*';
  }
}
