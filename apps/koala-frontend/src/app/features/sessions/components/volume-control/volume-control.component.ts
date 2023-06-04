import { Component, EventEmitter, Output } from '@angular/core';
import { MediaActions, MediaEvent } from '../../services/media-control.service';

@Component({
  selector: 'koala-volume-control',
  templateUrl: './volume-control.component.html',
  styleUrls: [
    './volume-control.component.scss',
  ],
})
export class VolumeControlComponent {
  @Output() mediaEvent: EventEmitter<MediaEvent> = new EventEmitter<MediaEvent>();

  muted = 0;
  mutedIcon = 'pi pi-volume-up';

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
