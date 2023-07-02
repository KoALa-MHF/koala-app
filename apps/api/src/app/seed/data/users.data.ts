import { User } from '../../users/entities/user.entity';

export enum UserDataKey {
  sessionOwner1 = 'SESSION_OWNER_1',
  sessionOwner2 = 'SESSION_OWNER_2',
  sessionParticipant1 = 'SESSION_PARTICIPANT_1',
  sessionParticipant2 = 'SESSION_PARTICIPANT_2',
}

export const UsersData: { [key in UserDataKey]: Partial<User> } = {
  [UserDataKey.sessionOwner1]: {
    id: 1,
    displayName: 'Session Owner 1',
    email: 'session-owner-1@koala-app.de',
    samlId: '123456',
  },
  [UserDataKey.sessionOwner2]: {
    id: 2,
    displayName: 'Session Owner 2',
    email: 'session-owner-2@koala-app.de',
    samlId: '654321',
  },
  [UserDataKey.sessionParticipant1]: {
    id: 3,
    displayName: 'Session Participant 1',
    email: 'session-participant-1@koala-app.de',
  },
  [UserDataKey.sessionParticipant2]: {
    id: 4,
    displayName: 'Session Participant 2',
    email: 'session-participant-2@koala-app.de',
  },
};
