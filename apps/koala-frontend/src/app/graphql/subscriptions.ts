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
      lockAnnotationDelete
      playMode
      playPosition
      liveSessionStart
      liveSessionEnd
      currentSessionServerTime
      isSessionOwner
      isAudioSession
      toolbars {
        id
        markers {
          marker {
            id
            name
            abbreviation
            description
            color
            contentColor
            icon
            valueRangeFrom
            valueRangeTo
          }
          visible
        }
        createdAt
        updatedAt
      }
      userSessions {
        id
        owner {
          id
          email
          displayName
        }
        annotations {
          id
          start
          end
          value
          media {
            id
          }
          marker {
            id
            type
            name
            abbreviation
            description
            color
            contentColor
            icon
            valueRangeFrom
            valueRangeTo
          }
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
        marker {
          id
          name
          abbreviation
          description
          color
          contentColor
          icon
          valueRangeFrom
          valueRangeTo
        }
        visible
      }
      createdAt
      updatedAt
    }
  }
`;
