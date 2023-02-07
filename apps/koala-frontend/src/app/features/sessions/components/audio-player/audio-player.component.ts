import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MediaActions, MediaControlService, MediaEvent } from '../../services/media-control.service';

@Component({
  selector: 'koala-app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: [
    './audio-player.component.scss',
    '../../session-common.scss',
  ],
  providers: [
    MediaControlService,
  ],
})
export class AudioPlayerComponent {
  @Input() metadata: MediaMetadata | undefined;
  @Output() mediaEvent: EventEmitter<MediaEvent> = new EventEmitter<MediaEvent>();

  volume = 5;
  constructor(public mc: MediaControlService) {}

  onPlay() {
    this.mediaEvent.emit({ actions: MediaActions.Play });
  }

  onStop() {
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
}
