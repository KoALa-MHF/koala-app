import { gql } from 'apollo-angular';

const GET_SESSIONS = gql`
  query GetSessions {
    sessions {
      id
      name
      description
      status
      start
      end
      editable
      enablePlayer
      displaySampleSolution
      enableLiveAnalysis
      media {
        id
        name
        mimeType
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

const GET_ONE_SESSION = gql`
  query GetOneSession($sessionId: Int!) {
    session(id: $sessionId) {
      id
      name
      description
      status
      start
      end
      editable
      enablePlayer
      displaySampleSolution
      enableLiveAnalysis
      media {
        id
        name
        mimeType
        createdAt
        updatedAt
      }
      markers {
        id
        name
        type
        abbreviation
        description
        color
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
