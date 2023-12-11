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
      lockAnnotationDelete
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
          role
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
        role
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
      lockAnnotationDelete
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
          role
        }
        annotations {
          id
          comments {
            id
            text
            owner {
              id
              role
              createdAt
              updatedAt
            }
          }
          media {
            id
          }
          end
          start
          value
          marker {
            id
            name
            type
            color
            contentColor
          }
        }
      }
      owner {
        id
        role
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
      owner {
        id
        role
        createdAt
        updatedAt
      }
    }
  }
`;

const GET_USER = gql`
  query getUser {
    me {
      id
      displayName
      email
      role
      createdAt
      updatedAt
    }
  }
`;

const GET_SESSION_FOR_EXPORT = gql`
  query sessionExport($sessionId: Int!) {
    session(id: $sessionId) {
      id
      start
      end
      name
      description
      status
      isAudioSession
      userSessions {
        id
        status
        note
        annotations {
          id
          start
          end
          value
          comments {
            id
            text
            owner {
              id
              role
              createdAt
              updatedAt
            }
          }
          media {
            id
          }
          marker {
            id
            type
            name
            abbreviation
            description
            color
            contentColor
            icon
            valueRangeFrom
            valueRangeTo
          }
        }
      }
    }
  }
`;

const GET_SESSION_FOR_CSV_EXPORT = gql`
  query sessionCSVExport($sessionId: Int!) {
    session(id: $sessionId) {
      id
      start
      end
      name
      description
      status
      isAudioSession
      owner {
        id
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
        status
        note
        owner {
          id
        }
        annotations {
          id
          start
          end
          value
          media {
            id
          }
          marker {
            id
            type
            name
            abbreviation
            description
            color
            contentColor
            icon
            valueRangeFrom
            valueRangeTo
          }
        }
      }
    }
  }
`;
