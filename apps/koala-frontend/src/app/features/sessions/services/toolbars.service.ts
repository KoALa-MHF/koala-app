import { Injectable } from '@angular/core';
import {
  OnToolbarUpdatedGQL,
  SetMarkerVisibilityInToolbarGQL,
  SetToolbarMarkerVisibilityInput,
  UpdateToolbarGQL,
  UpdateToolbarInput,
} from '../../../graphql/generated/graphql';

@Injectable()
export class ToolbarsService {
  constructor(
    private readonly updateToolbarGQL: UpdateToolbarGQL,
    private readonly onToolbarUpdatedGQL: OnToolbarUpdatedGQL,
    private readonly setMarkerVisibilityInToolbarGQL: SetMarkerVisibilityInToolbarGQL
  ) {}

  update(id: number, updateToolbarInput: UpdateToolbarInput) {
    return this.updateToolbarGQL.mutate({
      id,
      updateToolbarInput,
    });
  }

  setVisibilityForMarker(id: number, setToolbarMarkerVisibilityInput: SetToolbarMarkerVisibilityInput) {
    return this.setMarkerVisibilityInToolbarGQL.mutate({
      id,
      setToolbarMarkerVisibilityInput,
    });
  }

  subscribeUpdated(id: number) {
    return this.onToolbarUpdatedGQL.subscribe({
      toolbarId: id.toString(),
    });
  }
}
