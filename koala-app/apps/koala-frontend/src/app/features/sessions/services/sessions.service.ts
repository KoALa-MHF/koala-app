import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable } from 'rxjs';

import {
  CreateNewSessionGQL,
  DeleteSessionGQL,
  GetSessionsGQL
} from '../../../graphql/generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  constructor(
    private readonly getSessionGQL: GetSessionsGQL,
    private readonly createSessionGQL: CreateNewSessionGQL,
    private readonly deleteSessionGQL: DeleteSessionGQL
  ) {}

  getAll(): Observable<ApolloQueryResult<unknown>> {
    return this.getSessionGQL.watch({}, {
        pollInterval: 500
    }).valueChanges;
  }

  create(name: string) {
    return this.createSessionGQL.mutate({ name });
  }

  delete(id: number) {
    return this.deleteSessionGQL.mutate({ id });
  }
}
