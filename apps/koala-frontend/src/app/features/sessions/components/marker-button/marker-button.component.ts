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
  @Output() event = new EventEmitter<Marker>();
  isActive = false;
  range = 0;
  sliderValue = 0;

  onClick(ev: any) {
    console.log(ev);
    if (this.marker.type == MarkerType.Event) {
      this.eventButton();
    }
    if (this.marker.type == MarkerType.Range) {
      this.rangeButton();
    }
    //todo: slider range button
  }

  private rangeButton() {
    this.event.emit(this.marker);
  }

  private eventButton() {
    this.event.emit(this.marker);
    this.isActive = !this.isActive;
  }
}
