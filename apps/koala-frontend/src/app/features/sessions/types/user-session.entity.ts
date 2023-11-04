import { Role } from '../../../graphql/generated/graphql';
import { Annotation } from './annotation.entity';

export interface UserSession {
  id: number;
  owner?: {
    id?: string | null;
    email?: string | null;
    displayName?: string | null;
    role?: Role | null;
  };
  annotations?: Annotation[] | null;
}
