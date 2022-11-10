import { gql } from 'apollo-angular';

const CREATE_SESSION = gql`
mutation createNewSession($session: CreateSessionInput!) {
    createSession(createSessionInput: $session) {
      id
      name
      description
    }
  }
`;

const UPDATE_SESSION = gql`
  mutation updateSession($session: UpdateSessionInput!) {
    updateSession(updateSessionInput: $session) {
      id
      name
      description
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
