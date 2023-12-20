import { Annotation } from '../annotations/entities/annotation.entity';
import { Marker } from '../markers/entities/marker.entity';
import { Media } from '../media/entities/media.entity';
import { Session } from '../sessions/entities/session.entity';
import { UserSession } from '../user-sessions/entities/user-session.entity';
import { User } from '../users/entities/user.entity';

export type SeederOptions = {
  users?: User[];
  userSessions?: UserSession[];
  sessions?: Session[];
  annotations?: Annotation[];
  markers?: Marker[];
  media?: Media[];
};
export interface SeederInterface<T> {
  seed: (options?: SeederOptions) => Promise<T[]>;
}
