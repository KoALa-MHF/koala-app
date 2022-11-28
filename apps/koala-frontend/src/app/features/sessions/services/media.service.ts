import { Injectable } from '@angular/core';

import {
  CreateMediaGQL,
  UpdateMediaGQL,
  CreateMediaInput,
  UpdateMediaInput,
} from '../../../graphql/generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  constructor(
    private readonly createMediaGQL: CreateMediaGQL,
    private readonly updateMediaGQL: UpdateMediaGQL
  ) {}

  create(media: CreateMediaInput) {
    return this.createMediaGQL.mutate({ media });
  }

  update(id: number, media: UpdateMediaInput) {
    return this.updateMediaGQL.mutate({ id, updateMedia: media });
  }
}
