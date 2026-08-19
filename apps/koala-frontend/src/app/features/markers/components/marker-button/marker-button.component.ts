import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Marker } from '../../../sessions/types/marker.entity';
import { MarkerType } from '../../../../graphql/generated/graphql';
import { MediaControlService, MediaActions } from '../../../sessions/services/media-control.service';
import { filter } from 'rxjs';

@Component({
  selector: 'koala-marker-button',
  templateUrl: './marker-button.component.html',
  styleUrls: [
    './marker-button.component.scss',
  ],
})
export class MarkerButtonComponent implements OnInit {
  MarkerType = MarkerType;
  @Input() marker!: Marker;
  @Output() event = new EventEmitter<{ marker: Marker; value?: number }>();
  @Input() active = false;
  range = 0;
  sliderValue = 0;
  _enabled = false;

  @Input() set enabled(value: boolean) {
    this._enabled = value;
    if (!value) {
      this.active = false;
    }
  }

  get enabled(): boolean {
    return this._enabled;
  }

  constructor(private readonly mediaControlService: MediaControlService) {}

  ngOnInit(): void {
    this.sliderValue = this.marker.valueRangeFrom || 0;
    this.mediaControlService.mediaPlayStateChanged$
      .pipe(filter((mediaAction) => mediaAction === MediaActions.Stop || mediaAction === MediaActions.Seeking))
      .pipe(filter(() => this.marker.type === MarkerType.Range))
      .subscribe({
        next: () => {
          if (this.active) {
            this.active = false;
          }
        },
      });
  }

  onClick() {
    switch (this.marker.type) {
      case MarkerType.Event:
        this.eventButton();
        break;
      case MarkerType.Range:
        this.rangeButton();
        break;
    }
  }

  onSlideEnd() {
    this.sliderButton();
  }

  private rangeButton() {
    this.event.emit({ marker: this.marker });
    this.active = !this.active;
  }

  private eventButton() {
    this.event.emit({ marker: this.marker });
  }

  private sliderButton() {
    this.event.emit({ marker: this.marker, value: this.sliderValue || 0 });
  }
}
