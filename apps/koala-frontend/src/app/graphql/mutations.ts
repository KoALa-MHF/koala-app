import { gql } from 'apollo-angular';

const CREATE_SESSION = gql`
  mutation createNewSession($session: CreateSessionInput!) {
    createSession(createSessionInput: $session) {
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
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_SESSION = gql`
  mutation updateSession($id: Int!, $session: UpdateSessionInput!) {
    updateSession(id: $id, updateSessionInput: $session) {
      name
      description
      status
      start
      end
      editable
      enablePlayer
      displaySampleSolution
      enableLiveAnalysis
      code
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

const DELETE_SESSION = gql`
  mutation deleteSession($id: Int!) {
    removeSession(id: $id) {
      id
    }
  }
`;

const DELETE_ANNOTATION = gql`
  mutation deleteAnnotation($id: Int!) {
    removeAnnotation(id: $id) {
      id
    }
  }
`;

const CREATE_MEDIA = gql`
  mutation createMedia($media: CreateMediaInput!) {
    createMedia(createMediaInput: $media) {
      id
    }
  }
`;

const CREATE_MARKER = gql`
  mutation createMarker($createMarker: CreateMarkerInput!) {
    createMarker(createMarkerInput: $createMarker) {
      id
      type
      name
      color
    }
  }
`;

const UPDATE_TOOLBAR = gql`
  mutation updateToolbar($id: Int!, $updateToolbarInput: UpdateToolbarInput!) {
    updateToolbar(id: $id, updateToolbarInput: $updateToolbarInput) {
      id
      markers {
        markerId
        visible
      }
    }
  }
`;

const SET_MARKER_VISIBILITY_IN_TOOLBAR = gql`
  mutation setMarkerVisibilityInToolbar($id: Int!, $setToolbarMarkerVisibilityInput: SetToolbarMarkerVisibilityInput!) {
    setMarkerVisible(id: $id, updateToolbarMarkerVisible: $setToolbarMarkerVisibilityInput) {
      id
      markers {
        markerId
        visible
      }
    }
  }
`;

const AUTHENTICATE_W_SESSIONCODE = gql`
  mutation authenticateSessionCode($sessionCode: String!) {
    authenticateUserSession(authenticateUserSessionInput: { code: $sessionCode }) {
      accessToken
    }
  }
`;

const CREATE_USERSESSION = gql`
  mutation createUserSession($sessionId: Int!, $email: String!) {
    createUserSession(createUserSessionInput: { sessionId: $sessionId, owner: { email: $email } }) {
      id
      owner {
        email
      }
    }
  }
`;

const INVITE_PARTICIPANTS = gql`
  mutation inviteParticipants($userSessionIds: [ID!]!, $message: String!) {
    inviteUserSession(inviteUserSessionInput: { userSessionIds: $userSessionIds, message: $message }) {
      status
      invitedAt
    }
  }
`;

const REMOVE_USERSESSION = gql`
  mutation removeUserSession($userSessionId: Int!) {
    removeUserSession(id: $userSessionId) {
      id
    }
  }
`;

const UPDATE_USER = gql`
  mutation updateUser($displayName: String!) {
    updateUser(updateUserInput: { displayName: $displayName }) {
      id
      displayName
    }
  }
`;

const CREATE_ANNOTATION = gql`
  mutation createAnnotation($createAnnotation: CreateAnnotationInput!) {
    createAnnotation(createAnnotationInput: $createAnnotation) {
      id
      marker {
        id
      }
      userSession {
        id
      }
      start
      end
      value
    }
  }
`;

const SET_PLAY_MODE = gql`
  mutation setPlayMode($sessionId: Int!, $setPlayModeInput: SetPlayModeInput!) {
    setPlayMode(id: $sessionId, setPlayModeInput: $setPlayModeInput) {
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
        }
        annotations {
          id
          end
          start
          value
          marker {
            id
            color
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

const SET_PLAY_POSITION = gql`
  mutation setPlayPosition($sessionId: Int!, $setPlayPositionInput: SetPlayPositionInput!) {
    setPlayPosition(id: $sessionId, setPlayPositionInput: $setPlayPositionInput) {
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
        }
        annotations {
          id
          end
          start
          value
          marker {
            id
            color
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
