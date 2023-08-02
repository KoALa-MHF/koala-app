import { Component, Input } from '@angular/core';
import { Marker } from '../../../sessions/types/marker.entity';

@Component({
  selector: 'koala-marker-preview',
  templateUrl: './marker-preview.component.html',
  styleUrls: [
    './marker-preview.component.scss',
  ],
})
export class MarkerPreviewComponent {
  @Input() marker!: Marker;
}
