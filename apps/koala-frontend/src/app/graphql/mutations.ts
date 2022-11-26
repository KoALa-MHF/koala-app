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
      isEditable
      isPlayerEnabled
      isSampleSolutionDisplayed
      isLiveAnalysisDisplayed
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
      isEditable
      isPlayerEnabled
      isSampleSolutionDisplayed
      isLiveAnalysisDisplayed
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
