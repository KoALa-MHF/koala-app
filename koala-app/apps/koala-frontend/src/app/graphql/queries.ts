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