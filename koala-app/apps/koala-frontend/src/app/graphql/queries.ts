import { gql } from "apollo-angular";

const GET_SESSIONS = gql`
  query GetSessions {
    sessions {
      id
      name
      description
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
        description
        createdDate
        updatedDate
    }
}`