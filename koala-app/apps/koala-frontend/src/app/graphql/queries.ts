import { gql } from "apollo-angular";

const GET_SESSIONS = gql`
  query GetSessions {
    sessions {
      id
      name
      createdDate
      updatedDate
    }
  }
`;

const GET_ONE_SESSION = gql`
query GetOneSession($sessionId: Int!) {
    session(id: $sessionId) {
        id
        name
        createdDate
        updatedDate
    }
}`