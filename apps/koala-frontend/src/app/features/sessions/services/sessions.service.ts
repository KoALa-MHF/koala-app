import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { QueryRef } from 'apollo-angular';
import { Observable } from 'rxjs';

import {
  CreateNewSessionGQL,
  DeleteSessionGQL,
  GetSessionsGQL,
  GetSessionsQuery,
  GetOneSessionGQL,
  GetOneSessionQuery,
  UpdateSessionGQL,
  UpdateSessionInput,
  CreateSessionInput,
  Exact,
  CreateMediaInput,
  AddMarkerToSessionInput,
  AddMarkerGQL,
} from '../../../graphql/generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  allSessionsQuery: QueryRef<GetSessionsQuery, Exact<{ [key: string]: never }>>;

  constructor(
    private readonly getSessionGQL: GetSessionsGQL,
    private readonly getOneSessionGQL: GetOneSessionGQL,
    private readonly createSessionGQL: CreateNewSessionGQL,
    private readonly updateSessionGQL: UpdateSessionGQL,
    private readonly deleteSessionGQL: DeleteSessionGQL,
    private readonly addMarkerGQL: AddMarkerGQL
  ) {
    this.allSessionsQuery = this.getSessionGQL.watch({});
  }

  getAll(): Promise<ApolloQueryResult<GetSessionsQuery>> {
    return this.allSessionsQuery.refetch();
  }

  getOne(id: number): Observable<ApolloQueryResult<GetOneSessionQuery>> {
    return this.getOneSessionGQL.watch({
      sessionId: id,
    }).valueChanges;
  }

  create(session: CreateSessionInput) {
    return this.createSessionGQL.mutate({ session });
  }

  update(id: number, session: UpdateSessionInput) {
    return this.updateSessionGQL.mutate({
      id,
      session,
    });
  }

  delete(id: number) {
    return this.deleteSessionGQL.mutate({ id });
  }

  addMarker(markerId: number, sessionId: number) {
    return this.addMarkerGQL.mutate({
      addMarkerToSession: {
        markerId,
        sessionId,
      },
    });
  }
}
