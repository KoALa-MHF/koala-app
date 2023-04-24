import { gql } from 'apollo-angular';

const SUBSCRIBE_SESSION_UPDATED = gql`
  subscription onSessionUpdated($sessionId: ID!) {
    sessionUpdated(id: $sessionId) {
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
      toolbars {
        id
        markers
        createdAt
        updatedAt
      }
      userSessions {
        id
        owner {
          email
        }
      }
    }
  }
`;
