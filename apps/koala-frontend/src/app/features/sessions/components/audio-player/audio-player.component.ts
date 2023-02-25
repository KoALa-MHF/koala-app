import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MediaActions, MediaEvent } from '../../services/media-control.service';

@Component({
  selector: 'koala-app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: [
    './audio-player.component.scss',
    '../../session-common.scss',
  ],
  providers: [],
})
export class AudioPlayerComponent {
  @Input() metadata: MediaMetadata | undefined;
  @Output() mediaEvent: EventEmitter<MediaEvent> = new EventEmitter<MediaEvent>();

  muted = 0;
  playing = false;
  mutedIcon = 'pi pi-volume-up';
  playIcon = 'pi pi-play';

  onPlay() {
    if (!this.playing) {
      this.playIcon = 'pi pi-pause';
      this.playing = true;
    } else {
      this.playIcon = 'pi pi-play';
      this.playing = false;
    }
    this.mediaEvent.emit({ actions: MediaActions.Play });
  }

  onStop() {
    if (this.playing) {
      this.playIcon = 'pi pi-play';
      this.playing = false;
    }
    this.mediaEvent.emit({ actions: MediaActions.Stop });
  }

  onSkipForward() {
    this.mediaEvent.emit({ actions: MediaActions.SkipForward });
  }

  onSkipBackward() {
    this.mediaEvent.emit({ actions: MediaActions.SkipBackward });
  }

  onVolumeChange(volume: any) {
    this.mediaEvent.emit({ actions: MediaActions.VolumeChange, value: volume });
  }

  onMute() {
    if (!this.muted) {
      this.mutedIcon = 'pi pi-volume-off';
      this.muted = 1;
    } else {
      this.mutedIcon = 'pi pi-volume-up';
      this.muted = 0;
    }
    this.mediaEvent.emit({ actions: MediaActions.Mute, value: this.muted });
  }
}
