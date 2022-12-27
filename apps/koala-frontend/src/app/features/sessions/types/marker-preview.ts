import { MarkerType } from '../../../graphql/generated/graphql';

export interface MarkerEntity {
  id: number;
  description: string;
  name: string;
  type: MarkerType;
  abbreviation: string;
  color: string;
}
