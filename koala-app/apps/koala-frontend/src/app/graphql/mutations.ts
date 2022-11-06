import { gql } from "apollo-angular";

const CREATE_SESSION = gql`
  mutation createNewSession($name: String!) {
    createSession(createSessionInput: { name: $name }) {
      id
      name
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