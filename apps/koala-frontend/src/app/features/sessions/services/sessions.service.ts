import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { MutationResult, QueryRef } from 'apollo-angular';
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
  CreateNewSessionMutation,
} from '../../../graphql/generated/graphql';
import { Session } from '../types/session.entity';

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
    private readonly deleteSessionGQL: DeleteSessionGQL
  ) {
    this.allSessionsQuery = this.getSessionGQL.watch({});
  }

  getAll(): Promise<ApolloQueryResult<GetSessionsQuery>> {
    return this.allSessionsQuery.refetch();
  }

  getOne(id: number): Observable<ApolloQueryResult<GetOneSessionQuery>> {
    return this.getOneSessionGQL.fetch({
      sessionId: id,
    });
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

  copySession(sessionId: number): Promise<Session | null> {
    return new Promise<Session | null>((resolve, reject) => {
      this.getOne(sessionId).subscribe({
        next: (result: ApolloQueryResult<GetOneSessionQuery>) => {
          this.createSessionGQL
            .mutate({
              session: {
                name: result.data.session.name + ' Copy',
                description: result.data.session.description,
                displaySampleSolution: result.data.session.displaySampleSolution,
                editable: result.data.session.editable,
                enableLiveAnalysis: result.data.session.enableLiveAnalysis,
                enablePlayer: result.data.session.enablePlayer,
                end: result.data.session.end,
                start: result.data.session.start,
              },
            })
            .subscribe({
              next: (newSessionResult: MutationResult<CreateNewSessionMutation>) => {
                resolve(newSessionResult.data?.createSession || null);
              },
              error: () => {
                reject();
              },
            });
        },
      });
    });
  }
}
