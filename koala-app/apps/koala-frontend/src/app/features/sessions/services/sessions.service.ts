import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
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
  CreateSessionInput
} from '../../../graphql/generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  constructor(
    private readonly getSessionGQL: GetSessionsGQL,
    private readonly getOneSessionGQL: GetOneSessionGQL,
    private readonly createSessionGQL: CreateNewSessionGQL,
    private readonly updateSessionGQL: UpdateSessionGQL,
    private readonly deleteSessionGQL: DeleteSessionGQL
  ) {}

  getAll(): Observable<ApolloQueryResult<GetSessionsQuery>>{
    return this.getSessionGQL.watch({}, {
        pollInterval: 500
    }).valueChanges;
  }

  getOne(id: number): Observable<ApolloQueryResult<GetOneSessionQuery>> {
    return this.getOneSessionGQL.watch({
        sessionId: id
    }).valueChanges;
  }

  create(session: CreateSessionInput) {
    return this.createSessionGQL.mutate({session});
  }

  update(session: UpdateSessionInput) {
    return this.updateSessionGQL.mutate({
        session
    });
  }

  delete(id: number) {
    return this.deleteSessionGQL.mutate({ id });
  }
}
