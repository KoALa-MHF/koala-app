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
  UpdateSessionInput
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

  create(name: string) {
    return this.createSessionGQL.mutate({ name });
  }

  update(session: UpdateSessionInput) {
    return this.updateSessionGQL.mutate({
        id: session.id,
        sessionName: session.name
    })
  }

  delete(id: number) {
    return this.deleteSessionGQL.mutate({ id });
  }
}
