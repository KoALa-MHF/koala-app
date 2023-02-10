import { MarkerType } from '../../../graphql/generated/graphql';

export interface MarkerEntity {
  id: number;
  description?: string | null;
  name: string;
  type: MarkerType;
  abbreviation: string;
  color: string;
  icon?: string | null;
}
