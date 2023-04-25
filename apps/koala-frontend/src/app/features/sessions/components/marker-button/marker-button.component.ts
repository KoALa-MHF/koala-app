import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Marker } from '../../types/marker.entity';
import { MarkerType } from '../../../../graphql/generated/graphql';

@Component({
  selector: 'koala-marker-button',
  templateUrl: './marker-button.component.html',
  styleUrls: [
    './marker-button.component.scss',
  ],
})
export class MarkerButtonComponent {
  MarkerType = MarkerType;
  @Input() marker!: Marker;
  @Output() event = new EventEmitter<{ marker: Marker; value?: number }>();
  isActive = false;
  range = 0;
  sliderValue = 0;

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

  onSlideEnd(event: any) {
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
    this.event.emit({ marker: this.marker, value: this.sliderValue });
  }
}
