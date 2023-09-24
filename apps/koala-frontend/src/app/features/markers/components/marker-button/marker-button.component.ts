import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Marker } from '../../../sessions/types/marker.entity';
import { MarkerType } from '../../../../graphql/generated/graphql';

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
  @Input() active = false;
  range = 0;
  sliderValue = 0;

  ngOnInit(): void {
    this.sliderValue = this.marker.valueRangeFrom || 0;
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
