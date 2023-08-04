import { Injectable } from '@angular/core';
import { GetMarkersGQL } from '../../../graphql/generated/graphql';

@Injectable({ providedIn: 'root' })
export class MarkersService {
  constructor(private readonly getMarkersGQL: GetMarkersGQL) {}

  getAll(ids?: Array<number>) {
    return this.getMarkersGQL.fetch({ ids }, { fetchPolicy: 'no-cache' });
  }
}
