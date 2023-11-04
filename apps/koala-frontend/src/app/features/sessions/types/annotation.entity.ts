import { Marker } from './marker.entity';

export interface Annotation {
  id: number;
  start: number;
  end?: number | null;
  note?: string | null;
  value?: number | null;
  marker?: Marker | null;
}
