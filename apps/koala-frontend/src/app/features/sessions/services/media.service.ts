import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateAnnotationMediaMutation,
  CreateSessionExternalMediaMutation,
  CreateSessionMediaMutation,
  RemoveSessionMediaMutation,
} from '../../../graphql/generated/graphql';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { MutationResult } from 'apollo-angular';

export enum MediaUploadState {
  started,
  completed,
}

@Injectable()
export class MediaService {
  private mediaUploadState = new BehaviorSubject<MediaUploadState>(MediaUploadState.completed);
  public mediaUploadStateChanged$ = this.mediaUploadState.asObservable();

  constructor(private readonly http: HttpClient) {}

  createSessionMedia(sessionId: number, file: File): Observable<MutationResult<CreateSessionMediaMutation>> {
    return this.upload<CreateSessionMediaMutation>(
      'mutation createSessionMedia($id: Int!, $createMediaInput: CreateMediaInput!) { createSessionMedia(id: $id, createMediaInput: $createMediaInput) { id } }',
      sessionId,
      file
    );
  }

  createAnnotationMedia(annotationId: number, file: File): Observable<MutationResult<CreateAnnotationMediaMutation>> {
    return this.upload<CreateAnnotationMediaMutation>(
      'mutation createAnnotationMedia($id: Int!, $createMediaInput: CreateMediaInput!) { createAnnotationMedia(id: $id, createMediaInput: $createMediaInput) { id } }',
      annotationId,
      file
    );
  }

  createSessionExternalMedia(
    sessionId: number,
    url: string
  ): Observable<MutationResult<CreateSessionExternalMediaMutation>> {
    const graphQLEndpoint = `${environment.graphqlBaseUrl}/graphql`;

    return this.http.post<MutationResult<CreateSessionExternalMediaMutation>>(
      graphQLEndpoint,
      {
        query: `
        mutation createSessionExternalMedia($id: Int!, $media: CreateExternalMediaInput!) {
          createSessionExternalMedia(id: $id, createExternalMediaInput: $media) {
            id
          }
        }
      `,
        variables: {
          id: sessionId,
          media: {
            url,
          },
        },
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  removeSessionMedia(sessionId: number): Observable<MutationResult<RemoveSessionMediaMutation>> {
    const graphQLEndpoint = `${environment.graphqlBaseUrl}/graphql`;

    return this.http.post<MutationResult<RemoveSessionMediaMutation>>(
      graphQLEndpoint,
      {
        query: `
          mutation removeSessionMedia($id: Int!) {
            removeSessionMedia(id: $id) {
              id
            }
          }
        `,
        variables: {
          id: sessionId,
        },
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }

  // uploads the file as multipart request to a mutation with the variables $id and $createMediaInput
  private upload<T>(query: string, id: number, file: File): Observable<MutationResult<T>> {
    const _map = {
      file: [
        'variables.createMediaInput.file',
      ],
    };

    const formData = new FormData();
    formData.append(
      'operations',
      JSON.stringify({
        query,
        variables: {
          id,
          createMediaInput: {
            file: null,
          },
        },
      })
    );

    formData.append('map', JSON.stringify(_map));
    formData.append('file', file);

    const graphQLEndpoint = `${environment.graphqlBaseUrl}/graphql`;

    this.mediaUploadState.next(MediaUploadState.started);

    return this.http
      .post<MutationResult<T>>(graphQLEndpoint, formData, {
        headers: new HttpHeaders({
          'apollo-require-preflight': 'true',
        }),
      })
      .pipe(tap(() => this.mediaUploadState.next(MediaUploadState.completed)));
  }
}
