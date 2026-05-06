import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateExternalMediaMutation, CreateMediaInput, CreateMediaMutation } from '../../../graphql/generated/graphql';
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

  create(media: CreateMediaInput): Observable<MutationResult<CreateMediaMutation>> {
    const _map = {
      file: [
        'variables.createMediaInput.file',
      ],
    };

    const formData = new FormData();
    formData.append(
      'operations',
      JSON.stringify({
        query:
          'mutation createMedia($createMediaInput: CreateMediaInput!) { createMedia(createMediaInput: $createMediaInput) { id name } }',
        variables: {
          createMediaInput: {
            file: null,
          },
        },
      })
    );

    formData.append('map', JSON.stringify(_map));
    formData.append('file', media.file);

    const graphQLEndpoint = `${environment.graphqlBaseUrl}/graphql`;

    this.mediaUploadState.next(MediaUploadState.started);

    return this.http
      .post<MutationResult<CreateMediaMutation>>(graphQLEndpoint, formData, {
        headers: new HttpHeaders({
          'apollo-require-preflight': 'true',
        }),
      })
      .pipe(tap(() => this.mediaUploadState.next(MediaUploadState.completed)));
  }

  createExternal(url: string): Observable<MutationResult<CreateExternalMediaMutation>> {
    const graphQLEndpoint = `${environment.graphqlBaseUrl}/graphql`;

    return this.http.post<MutationResult<CreateExternalMediaMutation>>(
      graphQLEndpoint,
      {
        query: `
        mutation createExternalMedia($media: CreateExternalMediaInput!) {
          createExternalMedia(createExternalMediaInput: $media) {
            id
          }
        }
      `,
        variables: {
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

  //delete media by id
  delete(id: number): Observable<void> {
    const graphQLEndpoint = `${environment.graphqlBaseUrl}/graphql`;

    return this.http.post<void>(
      graphQLEndpoint,
      {
        query: `
          mutation deleteMedia($id: Float!) {
            deleteMedia(id: $id) {
              id
            }
          }
        `,
        variables: {
          id,
        },
      },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      }
    );
  }
}
