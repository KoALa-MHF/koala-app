import { UsersData } from './users.data';

export const CommentsData = [
  {
    id: 1,
    owner: UsersData.sessionParticipant1,
    text: 'This is a comment from the Participant',
    annotationId: 1,
  },
  {
    id: 2,
    owner: UsersData.sessionOwner1,
    text: 'This is a comment from the Owner',
    annotationId: 1,
  },
];
