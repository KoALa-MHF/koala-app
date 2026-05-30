import type { GenericPlugin } from 'wavesurfer.js/dist/base-plugin.js';

type Handler = (...args: unknown[]) => void;

type SwitchTubeAction = 'play' | 'pause' | 'seek' | 'ready' | 'playing' | 'duration' | 'currentTime';

interface SwitchTubeMessage {
  action: SwitchTubeAction;
  to?: number;
}

const POLL_INTERVAL_MS = 250;
const SEEK_THRESHOLD_S = 1.5;
const FINISH_EPSILON_S = 0.5;

export class SwitchTubeWaveSurferMock {
  private readonly iframe: HTMLIFrameElement;
  private readonly targetOrigin: string;
  private readonly handlers = new Map<string, Set<Handler>>();

  private duration = 0;
  private currentTime = 0;
  private playing = false;
  private interact = true;
  private volume = 1;
  private muted = false;
  private destroyed = false;
  private readyEmitted = false;

  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private lastPolledTime = 0;
  private lastPollAt = 0;

  constructor(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.targetOrigin = resolveOrigin(iframe);
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
    this.post({ action: 'play' });
    return Promise.resolve();
  }

  pause(): void {
    this.post({ action: 'pause' });
  }

  stop(): void {
    this.pause();
    this.setTime(0);
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
    this.post({ action: 'seek', to: seconds });
    this.currentTime = seconds;
    this.lastPolledTime = seconds;
  }

  setVolume(volume: number): void {
    // SwitchTube embed has no volume control — track locally.
    this.volume = volume;
  }

  getVolume(): number {
    return this.volume;
  }

  setMuted(muted: boolean): void {
    // SwitchTube embed has no mute control — track locally.
    this.muted = muted;
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
    // Plugins (e.g. timeline) are not backed by SwitchTube — accept and ignore.
    return plugin;
  }

  zoom(_level: number): void {
    // No-op: SwitchTube renders its own UI inside the iframe.
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.pollTimer !== null) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
    this.handlers.clear();
  }

  // ---- internals ------------------------------------------------------------

  private bootstrap(): void {
    const start = () => {
      void this.waitForReady().then(() => {
        if (this.destroyed) return;
        this.startPolling();
      });
    };

    // Always wait for `load`: contentWindow exists immediately as about:blank
    // at the parent's origin, but posting to the cross-origin targetOrigin
    // before the SwitchTube document is loaded throws a DOMException.
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

  private async waitForReady(): Promise<void> {
    while (!this.destroyed) {
      const ready = await this.request<boolean>({ action: 'ready' }).catch(() => false);
      if (ready) {
        this.duration = (await this.request<number>({ action: 'duration' }).catch(() => 0)) || 0;
        if (!this.readyEmitted) {
          this.readyEmitted = true;
          this.emit('ready', this.duration);
        }
        return;
      }
      await delay(150);
    }
  }

  private startPolling(): void {
    this.lastPollAt = performance.now();
    this.pollTimer = setInterval(() => void this.poll(), POLL_INTERVAL_MS);
  }

  private async poll(): Promise<void> {
    if (this.destroyed) return;

    const [
      time,
      playing,
    ] = await Promise.all([
      this.request<number>({ action: 'currentTime' }).catch(() => this.currentTime),
      this.request<boolean>({ action: 'playing' }).catch(() => this.playing),
    ]);

    if (!this.duration) {
      this.duration = (await this.request<number>({ action: 'duration' }).catch(() => 0)) || 0;
    }

    const now = performance.now();
    const dt = (now - this.lastPollAt) / 1000;
    this.lastPollAt = now;

    const wasPlaying = this.playing;
    const prevTime = this.lastPolledTime;
    this.currentTime = time;
    this.lastPolledTime = time;
    this.playing = playing;

    // Detect a seek: time jumped further than wall-clock progression allows.
    const expectedDelta = wasPlaying ? dt : 0;
    const actualDelta = time - prevTime;
    const seeked = Math.abs(actualDelta - expectedDelta) > SEEK_THRESHOLD_S;
    if (seeked) {
      this.emit('seeking', time);
    }

    if (!wasPlaying && playing) {
      this.emit('play');
    } else if (wasPlaying && !playing) {
      if (this.duration > 0 && time >= this.duration - FINISH_EPSILON_S) {
        this.emit('finish');
      } else {
        this.emit('pause');
      }
    }

    if (playing && !seeked) {
      this.emit('audioprocess', time);
    }
  }

  private emit(event: string, ...args: unknown[]): void {
    const bucket = this.handlers.get(event);
    if (!bucket) return;
    for (const handler of bucket) {
      try {
        handler(...args);
      } catch (err) {
        console.error(`[SwitchTubeWaveSurferMock] handler for "${event}" threw`, err);
      }
    }
  }

  private post(message: SwitchTubeMessage): void {
    const target = this.iframe.contentWindow;
    if (!target) return;
    target.postMessage(message, this.targetOrigin);
  }

  private request<T>(message: SwitchTubeMessage): Promise<T> {
    const target = this.iframe.contentWindow;
    if (!target) return Promise.reject(new Error('iframe not ready'));

    return new Promise<T>((resolve, reject) => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => {
        channel.port1.close();
        reject(new Error(`SwitchTube "${message.action}" timed out`));
      }, 2000);

      channel.port1.onmessage = (event) => {
        clearTimeout(timer);
        channel.port1.close();
        resolve(event.data as T);
      };

      target.postMessage(message, this.targetOrigin, [
        channel.port2,
      ]);
    });
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

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
