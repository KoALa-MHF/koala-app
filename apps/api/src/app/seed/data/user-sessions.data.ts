import { UsersData } from './users.data';
import { SessionsData } from './sessions.data';

export const UserSessionsData = [
  {
    owner: UsersData.SESSION_PARTICIPANT_1,
    session: SessionsData[0],
  },
  {
    owner: UsersData.SESSION_PARTICIPANT_2,
    session: SessionsData[0],
  },
  {
    owner: UsersData.SESSION_OWNER_1,
    session: SessionsData[1],
  },
  {
    owner: UsersData.SESSION_PARTICIPANT_2,
    session: SessionsData[2],
  },
];
