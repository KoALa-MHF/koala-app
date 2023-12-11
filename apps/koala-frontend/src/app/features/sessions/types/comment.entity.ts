import { User } from '../../../graphql/generated/graphql';

export interface Comment {
  id: number;
  text: string;
  createdAt: Date;
  owner?: User | null;
}
