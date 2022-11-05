import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

import {
  CreateNewSessionGQL,
  DeleteSessionGQL,
} from '../../../generated/graphql';

const GET_SESSIONS = gql`
  query GetSessions {
    sessions {
      id
      name
      createdDate
      updatedDate
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  constructor(
    private readonly apollo: Apollo,
    private readonly createSessionGQL: CreateNewSessionGQL,
    private readonly deleteSessionGQL: DeleteSessionGQL
  ) {}

  getAll(): Observable<ApolloQueryResult<unknown>> {
    return this.apollo.watchQuery({
      query: GET_SESSIONS,
      pollInterval: 500,
    }).valueChanges;
  }

  create(name: string) {
    return this.createSessionGQL.mutate({ name });
  }

  delete(id: number) {
    return this.deleteSessionGQL.mutate({ id });
  }
}
