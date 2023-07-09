import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { MediaActions, MediaEvent } from '../../services/media-control.service';

@Component({
  selector: 'koala-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: [
    './audio-player.component.scss',
    '../../session-common.scss',
  ],
  providers: [],
})
export class AudioPlayerComponent implements OnInit {
  @Input() metadata: MediaMetadata | undefined;
  @Output() mediaEvent: EventEmitter<MediaEvent> = new EventEmitter<MediaEvent>();

  playing = false;
  playIcon = 'pi pi-play';

  ngOnInit() {
    navigator.mediaSession.setActionHandler('play', () => {
      this.onPlay();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      this.onPlay();
    });
  }

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
}
