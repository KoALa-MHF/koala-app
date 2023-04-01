import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateMediaInput, CreateMediaMutation } from '../../../graphql/generated/graphql';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { MutationResult } from 'apollo-angular';

@Injectable()
export class MediaService {
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

    const graphQLEndpoint = environment.production ? 'https://koala-app.de/graphql' : 'http://localhost:4200/graphql';

    return this.http.post<MutationResult<CreateMediaMutation>>(graphQLEndpoint, formData);
  }
}
