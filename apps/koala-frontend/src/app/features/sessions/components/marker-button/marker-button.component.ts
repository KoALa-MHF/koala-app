import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Marker } from '../../types/marker.entity';
import { MarkerType } from '../../../../graphql/generated/graphql';
import { MediaActions, MediaControlService } from '../../services/media-control.service';
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
  isActive = false;
  range = 0;
  sliderValue = 0;

  ngOnInit(): void {
    this.sliderValue = this.marker.valueRangeFrom || 0;
  }

  constructor(private readonly mediaControlService: MediaControlService) {
    this.mediaControlService.mediaPlayStateChanged$
      .pipe(filter((mediaAction) => mediaAction === MediaActions.Play))
      .subscribe({
        next: () => {
          this.sliderButton();
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
    this.isActive = !this.isActive;
  }

  private eventButton() {
    this.event.emit({ marker: this.marker });
  }

  private sliderButton() {
    this.event.emit({ marker: this.marker, value: this.sliderValue || 0 });
  }
}
