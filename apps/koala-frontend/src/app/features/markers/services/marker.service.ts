import { Injectable } from '@angular/core';
import {
  CreateMarkerGQL,
  CreateMarkerInput,
  GetMarkersGQL,
  GetMarkersQuery,
  UpdateMarkerGQL,
} from '../../../graphql/generated/graphql';
import { MarkerIcon } from '../../sessions/types/marker-icon.type';
import MarkerIcons from './marker-icons.json';
import { Observable, map } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';
import { Marker } from '../../sessions/types/marker.entity';

export const DEFAULT_ICON_COLOR = '#555bcf';
export const DEFAULT_VALUE_RANGE_FROM = 0;
export const DEFAULT_VALUE_RANGE_TO = 10;

@Injectable({ providedIn: 'root' })
export class MarkerService {
  icons: MarkerIcon[] = MarkerIcons;

  constructor(
    private readonly createMarkerGQL: CreateMarkerGQL,
    private readonly getMarkersGQL: GetMarkersGQL,
    private readonly updateMarkerGQL: UpdateMarkerGQL
  ) {}

  create(marker: CreateMarkerInput) {
    return this.createMarkerGQL.mutate({ createMarker: marker });
  }

  getAll(ids?: Array<number>): Observable<ApolloQueryResult<GetMarkersQuery>> {
    return this.getMarkersGQL.fetch({ ids }, { fetchPolicy: 'no-cache' });
  }

  getAllIcons(): MarkerIcon[] {
    return this.icons;
  }

  getIconByCode(code: string): MarkerIcon | undefined {
    const icon = this.icons.find((icon) => icon.code === code);
    return icon;
  }

  update(id: number, marker: Marker): Observable<Marker> {
    return this.updateMarkerGQL
      .mutate({
        markerId: id,
        updateMarkerInput: {
          name: marker.name,
          description: marker.description,
          color: marker.color,
          contentColor: marker.contentColor,
          abbreviation: marker.abbreviation,
          icon: marker.icon,
        },
      })
      .pipe(
        map((result) => result.data),
        map((data) => data?.updateMarker || marker)
      );
  }
}
