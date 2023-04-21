import { MarkerType } from '../../../graphql/generated/graphql';

export interface Marker {
  id: number;
  description?: string | null;
  name: string;
  type: MarkerType;
  abbreviation?: string | null;
  color: string;
  icon?: string | null;
  hidden: boolean | true;
  valueRangeFrom?: number | null;
  valueRangeTo?: number | null;
}
