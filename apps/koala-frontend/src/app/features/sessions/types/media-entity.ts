import { MediaType } from '../../../graphql/generated/graphql';

export interface Media {
  id: string;
  type: MediaType;
  title?: string | null;
  composer?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
