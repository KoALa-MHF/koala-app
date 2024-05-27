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
      lockAnnotationDelete
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
      contentColor
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
        role
        email
      }
    }
  }
`;

const INVITE_PARTICIPANTS = gql`
  mutation inviteParticipants($sessionId: Int!, $userSessionIds: [ID!]!, $message: String!) {
    inviteUserSession(
      inviteUserSessionInput: { sessionId: $sessionId, userSessionIds: $userSessionIds, message: $message }
    ) {
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
        type
        name
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
      lockAnnotationDelete
      playMode
      isAudioSession
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
          role
        }
        annotations {
          id
          end
          start
          value
          comments {
            id
            text
            createdAt
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
      lockAnnotationDelete
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
          role
        }
        annotations {
          id
          end
          start
          value
          comments {
            id
            text
            createdAt
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

const UPDATE_MARKER = gql`
  mutation updateMarker($markerId: Int!, $updateMarkerInput: UpdateMarkerInput!) {
    updateMarker(id: $markerId, updateMarkerInput: $updateMarkerInput) {
      id
      type
      name
      abbreviation
      description
      color
      icon
      contentColor
      valueRangeFrom
      valueRangeTo
      createdAt
      updatedAt
      owner {
        id
        role
        createdAt
        updatedAt
      }
    }
  }
`;

const UPDATE_ANNOTATION_NOTE = gql`
  mutation updateAnnotationNote($id: Int!, $note: String!) {
    updateAnnotation(id: $id, updateAnnotationInput: { note: $note }) {
      id
      note
    }
  }
`;

const UPDATE_ANNOTATION_MEDIA = gql`
  mutation updateAnnotationAudio($id: Int!, $mediaId: Int!) {
    updateAnnotation(id: $id, updateAnnotationInput: { mediaId: $mediaId }) {
      id
      media {
        id
      }
    }
  }
`;

const REMOVE_ANNOTATION_MEDIA = gql`
  mutation removeAnnotationAudio($id: Int!) {
    removeAnnotationMedia(id: $id) {
      id
    }
  }
`;

const CREATE_ANNOTATION_COMMENT = gql`
  mutation createAnnotationComment($annotationId: Int!, $commentText: String!) {
    createComment(createCommentInput: { annotationId: $annotationId, text: $commentText }) {
      id
      text
      owner {
        id
        role
        createdAt
        updatedAt
      }
    }
  }
`;

const UPDATE_ANNOTATION_COMMENT = gql`
  mutation updateAnnotationComment($commentId: Int!, $commentText: String!) {
    updateComment(id: $commentId, updateCommentInput: { text: $commentText }) {
      id
      text
      owner {
        id
        role
        createdAt
        updatedAt
      }
    }
  }
`;

const REMOVE_ANNOTATION_COMMENT = gql`
  mutation removeAnnotationComment($commentId: Int!) {
    removeComment(id: $commentId) {
      id
    }
  }
`;
