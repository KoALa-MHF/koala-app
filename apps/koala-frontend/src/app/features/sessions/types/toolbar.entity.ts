import { ToolbarMarker } from './toolbar-marker.entity';

export interface Toolbar {
  id: string;
  markers?: ToolbarMarker[] | null;
  createdAt: Date;
  updatedAt: Date;
}
