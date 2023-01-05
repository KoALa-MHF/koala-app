import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MediaActions, MediaControlService, MediaEvent } from '../../services/media-control.service';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Media } from 'apps/koala-frontend/src/app/graphql/generated/graphql';

@Component({
  selector: 'koala-app-session-audio-player',
  templateUrl: './session-audio-player.component.html',
  styleUrls: [
    './session-audio-player.component.scss',
    '../../session-common.scss',
  ],
  providers: [
    MediaControlService,
  ],
})
export class SessionAudioPlayerComponent {
  @Input() mediaData: Media;
  @Output() mediaEvent: EventEmitter<MediaEvent> = new EventEmitter<MediaEvent>();

  volume = 5;
  constructor(public mc: MediaControlService) {}

  onPlay() {
    this.mediaEvent.emit({ actions: MediaActions.Play, value: '' });
  }

  onStop() {
    this.mediaEvent.emit({ actions: MediaActions.Stop, value: '' });
  }

  onSkipForward() {
    this.mediaEvent.emit({ actions: MediaActions.SkipForward, value: '' });
  }

  onSkipBackward() {
    this.mediaEvent.emit({ actions: MediaActions.SkipBackward, value: '' });
  }

  onVolumeChange(volume: any) {
    this.mediaEvent.emit({ actions: MediaActions.VolumeChange, value: volume });
  }
}
