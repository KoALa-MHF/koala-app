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
        markers
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
      markers
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
    createUserSession(createUserSessionInput: { sessionId: $sessionId, user: { email: $email } }) {
      id
      user {
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
