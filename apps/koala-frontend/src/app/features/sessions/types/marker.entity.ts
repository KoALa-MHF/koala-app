import { MarkerType, User } from '../../../graphql/generated/graphql';

export interface Marker {
  id: number;
  description?: string | null;
  name: string;
  type: MarkerType;
  abbreviation?: string | null;
  color: string;
  contentColor: string;
  icon?: string | null;
  visible?: boolean | true;
  valueRangeFrom?: number | null;
  valueRangeTo?: number | null;
  owner?: User | null;
}
