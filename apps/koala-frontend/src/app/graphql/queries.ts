import { gql } from "apollo-angular";

const GET_SESSIONS = gql`
  query GetSessions {
    sessions {
      id
      name
      description
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
        createdAt
        updatedAt
    }
}`