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
