import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Marker } from '../../types/marker.entity';
import { MarkerType, PlayMode } from '../../../../graphql/generated/graphql';
import { filter } from 'rxjs';
import { SessionControlService } from '../../services/session-control.service';

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
  @Input() enabled = false;
  @Output() event = new EventEmitter<{ marker: Marker; value?: number }>();
  isActive = false;
  range = 0;
  sliderValue = 0;

  ngOnInit(): void {
    this.sliderValue = this.marker.valueRangeFrom || 0;
  }

  constructor(private readonly sessionControlService: SessionControlService) {
    this.sessionControlService.playModeChanged$
      .pipe(filter((playMode: PlayMode) => playMode === PlayMode.Paused))
      .subscribe({
        next: () => {
          if (this.marker.type === MarkerType.Range && this.isActive) {
            this.rangeButton();
          } else if (this.marker.type === MarkerType.Slider) {
            this.sliderButton();
          }
        },
      });

    this.sessionControlService.playModeChanged$
      .pipe(filter((playMode: PlayMode) => playMode === PlayMode.Running))
      .subscribe({
        next: () => {
          if (this.marker.type === MarkerType.Slider) {
            this.sliderButton();
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
    this.isActive = !this.isActive;
  }

  private eventButton() {
    this.event.emit({ marker: this.marker });
  }

  private sliderButton() {
    this.event.emit({ marker: this.marker, value: this.sliderValue || 0 });
  }
}
