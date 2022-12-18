import { Injectable } from '@angular/core';

import { CreateMarkerGQL, CreateMarkerInput } from '../../../graphql/generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private readonly createMarkerGQL: CreateMarkerGQL) {}

  create(marker: CreateMarkerInput) {
    return this.createMarkerGQL.mutate({ createMarker: marker });
  }
}
