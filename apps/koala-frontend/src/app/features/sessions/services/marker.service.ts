import { Injectable } from '@angular/core';
import { CreateMarkerGQL, CreateMarkerInput, GetMarkersGQL } from '../../../graphql/generated/graphql';
import { MarkerIcon } from '../types/marker-icon.type';
import MarkerIcons from './marker-icons.json';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  icons: MarkerIcon[] = MarkerIcons;

  constructor(private readonly createMarkerGQL: CreateMarkerGQL, private readonly getMarkersGQL: GetMarkersGQL) {}

  create(marker: CreateMarkerInput) {
    return this.createMarkerGQL.mutate({ createMarker: marker });
  }

  getAll(ids: Array<number>) {
    return this.getMarkersGQL.fetch({ ids });
  }

  getAllIcons(): MarkerIcon[] {
    return this.icons;
  }

  getIconByCode(code: string): MarkerIcon | undefined {
    const icon = this.icons.find((icon) => icon.code === code);
    return icon;
  }
}
