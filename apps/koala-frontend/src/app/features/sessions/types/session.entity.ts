import { SessionStatus } from '../../../graphql/generated/graphql';
import { Media } from './media.entity';
import { Toolbar } from './toolbar.entity';

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
  media?: Media | null;
  toolbars: Toolbar[];
  createdAt: Date;
  updatedAt: Date;
}
