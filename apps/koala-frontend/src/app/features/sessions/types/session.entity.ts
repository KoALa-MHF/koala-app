import { PlayMode, SessionStatus, User } from '../../../graphql/generated/graphql';
import { Media } from './media.entity';
import { Toolbar } from './toolbar.entity';
import { UserSession } from './user-session.entity';

export interface Session {
  id: string;
  name: string;
  description?: string | null;
  status?: SessionStatus | null;
  start?: Date | null;
  end?: Date | null;
  editable?: boolean | null;
  enablePlayer?: boolean | null;
  displaySampleSolution?: boolean | null;
  enableLiveAnalysis?: boolean | null;
  lockAnnotationDelete?: boolean | null;
  playMode?: PlayMode | null;
  playPosition?: number | null;
  liveSessionStart?: number | null;
  liveSessionEnd?: number | null;
  currentSessionServerTime?: number | null;
  media?: Media | null;
  code?: string;
  toolbars?: Toolbar[] | null;
  createdAt?: Date;
  updatedAt?: Date;
  userSessions?: UserSession[];
  owner?: User;
  isSessionOwner?: boolean;
  isAudioSession?: boolean;
}
