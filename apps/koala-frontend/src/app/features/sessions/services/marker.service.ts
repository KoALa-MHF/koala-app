import { Injectable } from '@angular/core';

import { CreateMarkerGQL, CreateMarkerInput, GetMarkersGQL } from '../../../graphql/generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private readonly createMarkerGQL: CreateMarkerGQL, private readonly getMarkersGQL: GetMarkersGQL) {}

  create(marker: CreateMarkerInput) {
    return this.createMarkerGQL.mutate({ createMarker: marker });
  }

  getAll(ids: Array<number>) {
    return this.getMarkersGQL.fetch({ ids });
  }
}
