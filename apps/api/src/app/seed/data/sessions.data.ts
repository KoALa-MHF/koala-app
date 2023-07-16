import { SessionStatus } from '../../sessions/entities/session.entity';
import { UsersData } from './users.data';

export const SessionsData = [
  {
    id: 1,
    name: 'Session 1',
    owner: UsersData.sessionOwner1,
    status: SessionStatus.IN_PREPARATION,
  },
  {
    id: 2,
    name: 'Session 2',
    owner: UsersData.sessionOwner2,
    status: SessionStatus.CLOSED,
  },
  {
    id: 3,
    name: 'Session 3',
    owner: UsersData.sessionOwner1,
    status: SessionStatus.IN_PREPARATION,
    start: Date.now(),
    end: Date.now() + 1000000,
  },
  {
    id: 4,
    name: 'Session 4',
    owner: UsersData.sessionOwner1,
    status: SessionStatus.OPEN,
    start: Date.now() - 2000,
    end: Date.now() - 1000,
  },
  {
    id: 5,
    name: 'Session 5',
    owner: UsersData.sessionOwner1,
    status: SessionStatus.ARCHIVED,
  },
];
