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
      playMode
      playPosition
      liveSessionStart
      liveSessionEnd
      currentSessionServerTime
      isSessionOwner
      isAudioSession
      code
      userSessions {
        id
        owner {
          id
          email
          displayName
        }
      }
      media {
        id
        name
        mimeType
        createdAt
        updatedAt
      }
      toolbars {
        id
        markers {
          markerId
          visible
        }
        createdAt
        updatedAt
      }
      owner {
        id
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
      playMode
      playPosition
      liveSessionStart
      liveSessionEnd
      currentSessionServerTime
      isSessionOwner
      isAudioSession
      code
      media {
        id
        name
        mimeType
        createdAt
        updatedAt
      }
      toolbars {
        id
        markers {
          markerId
          visible
        }
        createdAt
        updatedAt
      }
      userSessions {
        id
        owner {
          id
          email
          displayName
        }
        annotations {
          id
          end
          start
          value
          marker {
            id
            color
            contentColor
          }
        }
      }
      owner {
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

const GET_SESSION_ID_BY_CODE = gql`
  query GetOneSessionBySessionCode($code: String!) {
    sessionByCode(code: $code) {
      id
    }
  }
`;

const GET_MARKERS = gql`
  query GetMarkers($ids: [Int!]) {
    markers(ids: $ids) {
      id
      name
      abbreviation
      description
      color
      contentColor
      icon
      createdAt
      updatedAt
      type
      valueRangeFrom
      valueRangeTo
    }
  }
`;

const GET_USER = gql`
  query getUser {
    me {
      id
      displayName
      email
    }
  }
`;
