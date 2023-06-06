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
      playMode
      playPosition
      liveSessionStarted
      toolbars {
        id
        markers {
          markerId
          visible
        }
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

const SUBSCRIBE_TOOLBAR_UPDATED = gql`
  subscription onToolbarUpdated($toolbarId: ID!) {
    toolbarUpdated(id: $toolbarId) {
      id
      markers {
        markerId
        visible
      }
      createdAt
      updatedAt
    }
  }
`;
