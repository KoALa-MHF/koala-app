import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';

import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

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

const CREATE_SESSION = gql`
  mutation createNewSession($name: String!) {
    createSession(createSessionInput: { name: $name }) {
      id
      name
    }
  }
`;

const DELETE_SESSION = gql`
  mutation deleteSession($id: Int!) {
    removeSession(id: $id) {
        id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  constructor(private apollo: Apollo) {}

  getAll(): Observable<ApolloQueryResult<unknown>> {
    return this.apollo.watchQuery({
      query: GET_SESSIONS,
      pollInterval: 500,
    }).valueChanges;
  }

  create(name: string) {
    return this.apollo.mutate({
      mutation: CREATE_SESSION,
      variables: {
        name: name,
      },
    });
  }

  delete(id: number) {
    return this.apollo.mutate({
        mutation: DELETE_SESSION,
        variables: {
            id
        }
    })
  }
}
