import { Component, OnInit } from '@angular/core';
import { Marker } from '../../../sessions/types/marker.entity';
import { MarkersService } from '../../services/markers.service';
import { map } from 'rxjs';
import { Marker as MarkerType } from '../../../../graphql/generated/graphql';

@Component({
  selector: 'koala-markers-overview',
  templateUrl: './markers-overview.page.html',
  styleUrls: [
    './markers-overview.page.css',
  ],
})
export class MarkersOverviewPage implements OnInit {
  markers: Marker[] = [];

  constructor(private readonly markersService: MarkersService) {}

  ngOnInit() {
    this.markersService
      .getAll()
      .pipe(
        map((response) => response.data.markers),
        map((markers) =>
          markers.map((marker: MarkerType) => {
            return { ...marker, visible: true } as Marker;
          })
        )
      )
      .subscribe({
        next: (markers) => {
          this.markers = markers;
        },
      });
  }
}
