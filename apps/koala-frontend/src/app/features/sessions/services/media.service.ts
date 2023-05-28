import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateMediaInput, CreateMediaMutation } from '../../../graphql/generated/graphql';
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

    const graphQLEndpoint = `${environment.baseUrl}/graphql`;

    this.mediaUploadState.next(MediaUploadState.started);

    return this.http
      .post<MutationResult<CreateMediaMutation>>(graphQLEndpoint, formData, {
        headers: new HttpHeaders({
          'apollo-require-preflight': 'true',
        }),
      })
      .pipe(tap(() => this.mediaUploadState.next(MediaUploadState.completed)));
  }
}
