import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { MediaControlService, MediaActions, MediaEvent } from '../../services/media-control.service';

@Component({
  selector: 'koala-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: [
    './media-player.component.scss',
    '../../session-common.scss',
  ],
  providers: [],
})
export class MediaPlayerComponent implements OnInit {
  @Input() metadata: MediaMetadata | undefined;
  @Output() mediaEvent: EventEmitter<MediaEvent> = new EventEmitter<MediaEvent>();

  constructor(private readonly mediaControlService: MediaControlService) {}

  playing = false;
  playIcon = 'pi pi-play';

  ngOnInit() {
    navigator.mediaSession.setActionHandler('play', () => {
      this.onPlay();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      this.onPlay();
    });

    navigator.mediaSession.setActionHandler('stop', () => {
      this.onStop();
    });

    this.mediaControlService.mediaPlayStateChanged$.subscribe({
      next: (mediaAction) => {
        if (mediaAction === MediaActions.Play) {
          this.playing = true;
          this.playIcon = 'pi pi-pause';
        } else if (mediaAction === MediaActions.Stop || mediaAction === MediaActions.Finish) {
          this.playing = false;
          this.playIcon = 'pi pi-play';
        }
      },
    });
  }

  onPlay() {
    this.mediaEvent.emit({ actions: MediaActions.Play });
  }

  onStop() {
    this.mediaEvent.emit({ actions: MediaActions.Stop });
  }
}
