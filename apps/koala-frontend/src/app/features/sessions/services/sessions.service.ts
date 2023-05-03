import { Injectable } from '@angular/core';
import { ApolloQueryResult } from '@apollo/client/core';
import { MutationResult } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CreateNewSessionGQL,
  DeleteSessionGQL,
  GetSessionsGQL,
  GetOneSessionGQL,
  GetOneSessionQuery,
  UpdateSessionGQL,
  UpdateSessionInput,
  CreateSessionInput,
  CreateNewSessionMutation,
} from '../../../graphql/generated/graphql';
import { Session } from '../types/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    private readonly getSessionGQL: GetSessionsGQL,
    private readonly getOneSessionGQL: GetOneSessionGQL,
    private readonly createSessionGQL: CreateNewSessionGQL,
    private readonly updateSessionGQL: UpdateSessionGQL,
    private readonly deleteSessionGQL: DeleteSessionGQL
  ) {}

  getAll() {
    return this.getSessionGQL.fetch({}, { fetchPolicy: 'no-cache' }).pipe(map((data) => data.data.sessions));
  }

  getOne(id: number): Observable<ApolloQueryResult<GetOneSessionQuery>> {
    return this.getOneSessionGQL.fetch(
      {
        sessionId: id,
      },
      { fetchPolicy: 'no-cache' }
    );
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
