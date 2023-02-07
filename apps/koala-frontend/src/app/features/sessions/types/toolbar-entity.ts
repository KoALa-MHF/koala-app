import { MarkerEntity } from './marker-entity';

export interface Toolbar {
  id: string;
  markers: string[];
  createdAt: Date;
  updatedAt: Date;
}
