import { Component, OnInit } from '@angular/core';
import { Marker } from '../../../sessions/types/marker.entity';
import {
  DEFAULT_ICON_COLOR,
  DEFAULT_VALUE_RANGE_FROM,
  DEFAULT_VALUE_RANGE_TO,
  MarkerService,
} from '../../services/marker.service';
import { map } from 'rxjs';
import { MarkerType, Marker as MarkerGraphQL } from '../../../../graphql/generated/graphql';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { iconAbbreviationValidator } from '../../../../shared/icon-abbreviation.validator';
import { markerRangeValueValidator } from '../../../../shared/greater-than.validator';

@Component({
  selector: 'koala-markers-overview',
  templateUrl: './markers-overview.page.html',
  styleUrls: [
    './markers-overview.page.css',
  ],
})
export class MarkersOverviewPage implements OnInit {
  markers: Marker[] = [];

  maintainMarkerForm;

  constructor(private readonly markerService: MarkerService, private readonly formBuilder: FormBuilder) {
    this.maintainMarkerForm = this.formBuilder.group(
      {
        type: new FormControl<MarkerType | null>(null, [
          Validators.required,
        ]),
        name: new FormControl<string>('', [
          Validators.required,
        ]),
        description: new FormControl<string>(''),
        abbreviation: new FormControl<string>(''),
        color: new FormControl<string>(DEFAULT_ICON_COLOR, { nonNullable: true }),
        contentColor: new FormControl<boolean>(false, { nonNullable: true }),
        icon: new FormControl<string>(''),
        valueRangeFrom: new FormControl<number>(DEFAULT_VALUE_RANGE_FROM),
        valueRangeTo: new FormControl<number>(DEFAULT_VALUE_RANGE_TO),
      },
      {
        validators: [
          iconAbbreviationValidator,
          markerRangeValueValidator,
        ],
      }
    );
  }

  ngOnInit() {
    this.loadMarkerData();
  }

  private loadMarkerData() {
    this.markerService
      .getAll()
      .pipe(
        map((response) => response.data.markers),
        map((markers) =>
          markers.map((marker: MarkerGraphQL) => {
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

  public onResetMarkerData() {
    this.maintainMarkerForm.reset({
      valueRangeFrom: DEFAULT_VALUE_RANGE_FROM,
      valueRangeTo: DEFAULT_VALUE_RANGE_TO,
      color: DEFAULT_ICON_COLOR,
      contentColor: false,
    });
  }

  public onCreateMarker() {
    this.markerService
      .create({
        description: this.maintainMarkerForm.value.description,
        name: this.maintainMarkerForm.value.name || '',
        type: this.maintainMarkerForm.value.type || MarkerType.Event,
        abbreviation: this.maintainMarkerForm.value.abbreviation,
        color: this.maintainMarkerForm.value.color,
        contentColor: this.maintainMarkerForm.value.contentColor ? '#000000' : '#FFFFFF',
        icon: this.maintainMarkerForm.value.icon,
        valueRangeFrom: this.maintainMarkerForm.value.valueRangeFrom,
        valueRangeTo: this.maintainMarkerForm.value.valueRangeTo,
      })
      .subscribe({
        next: () => {
          this.loadMarkerData();
        },
        error: () => {
          console.error('Create Marker Error');
        },
      });
  }
}
