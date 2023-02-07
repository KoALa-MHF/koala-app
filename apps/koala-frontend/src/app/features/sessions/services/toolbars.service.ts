import { Injectable } from '@angular/core';
import { UpdateToolbarGQL, UpdateToolbarInput } from '../../../graphql/generated/graphql';

@Injectable({
  providedIn: 'root',
})
export class ToolbarsService {
  constructor(private readonly updateToolbarGQL: UpdateToolbarGQL) {}

  update(id: number, updateToolbarInput: UpdateToolbarInput) {
    return this.updateToolbarGQL.mutate({
      id,
      updateToolbarInput,
    });
  }
}
