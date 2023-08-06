import { Component, Input } from '@angular/core';
import { MarkerIcon } from '../../../sessions/types/marker-icon.type';
import { MarkerService } from '../../services/marker.service';

@Component({
  selector: 'koala-marker-icon',
  templateUrl: './marker-icon.component.html',
  styleUrls: [
    './marker-icon.component.scss',
  ],
})
export class MarkerIconComponent {
  @Input() set iconCode(value: string | null | undefined) {
    if (value) {
      this.marker = this.markersService.getIconByCode(value);
    } else {
      this.marker = null;
    }
  }
  marker: MarkerIcon | null | undefined;

  constructor(private readonly markersService: MarkerService) {}
}
