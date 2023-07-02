import { UsersData } from './users.data';
import { SessionsData } from './sessions.data';

export const UserSessionsData = [
  {
    owner: UsersData.sessionParticipant1,
    session: SessionsData[0],
  },
  {
    owner: UsersData.sessionParticipant2,
    session: SessionsData[0],
  },
  {
    owner: UsersData.sessionOwner1,
    session: SessionsData[1],
  },
  {
    owner: UsersData.sessionParticipant2,
    session: SessionsData[2],
  },
];
