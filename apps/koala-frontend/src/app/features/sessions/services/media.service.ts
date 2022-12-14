import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UpdateMediaGQL, CreateMediaInput, UpdateMediaInput } from '../../../graphql/generated/graphql';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(private readonly updateMediaGQL: UpdateMediaGQL, private readonly http: HttpClient) {}

  create(media: CreateMediaInput) {
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
          'mutation createMedia($createMediaInput: CreateMediaInput!) { createMedia(createMediaInput: $createMediaInput) { id type } }',
        variables: {
          createMediaInput: {
            type: media.type,
            file: null,
          },
        },
      })
    );

    formData.append('map', JSON.stringify(_map));
    formData.append('file', media.file);

    const graphQLEndpoint = environment.production ? 'https://koala-app.de/graphql' : 'http://localhost:4200/graphql';

    return this.http.post(graphQLEndpoint, formData);
  }

  update(id: number, media: UpdateMediaInput) {
    return this.updateMediaGQL.mutate({ id, updateMedia: media });
  }
}
