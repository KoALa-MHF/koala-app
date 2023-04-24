import { Injectable } from '@angular/core';
import { OnToolbarUpdatedGQL, UpdateToolbarGQL, UpdateToolbarInput } from '../../../graphql/generated/graphql';

@Injectable()
export class ToolbarsService {
  constructor(
    private readonly updateToolbarGQL: UpdateToolbarGQL,
    private readonly onToolbarUpdatedGQL: OnToolbarUpdatedGQL
  ) {}

  update(id: number, updateToolbarInput: UpdateToolbarInput) {
    return this.updateToolbarGQL.mutate({
      id,
      updateToolbarInput,
    });
  }

  subscribeUpdated(id: number) {
    return this.onToolbarUpdatedGQL.subscribe({
      toolbarId: id.toString(),
    });
  }
}
