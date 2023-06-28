import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Annotation = {
  __typename?: 'Annotation';
  /** Creation Date */
  createdAt: Scalars['DateTime'];
  /** Annotation End Seconds */
  end?: Maybe<Scalars['Int']>;
  /** ID for Annotation */
  id: Scalars['Int'];
  /** Associated Marker */
  marker: Marker;
  /** Annotation Note */
  note?: Maybe<Scalars['String']>;
  /** Annotation Start Seconds */
  start: Scalars['Int'];
  /** Date of Last Update */
  updatedAt: Scalars['DateTime'];
  /** Associated UserSession */
  userSession: UserSession;
  /** Annotation Value */
  value?: Maybe<Scalars['Int']>;
};

export type AuthenticateSessionInput = {
  /** Session Code */
  code: Scalars['String'];
};

export type AuthenticateUserSessionInput = {
  /** User Session Code */
  code: Scalars['String'];
};

export type Authentication = {
  __typename?: 'Authentication';
  /** JWT Bearer Token */
  accessToken: Scalars['String'];
  /** Authenticated user */
  user: User;
};

export type CreateAnnotationInput = {
  /** Annotation End Seconds */
  end?: InputMaybe<Scalars['Int']>;
  /** Associated Marker */
  markerId: Scalars['Int'];
  /** Annotation Note */
  note?: Scalars['String'];
  /** Annotation Start Seconds */
  start: Scalars['Int'];
  /** Associated User Session */
  userSessionId: Scalars['Int'];
  /** Annotation Value */
  value?: InputMaybe<Scalars['Int']>;
};

export type CreateMarkerInput = {
  /** Marker Name Abbreviation (e.g. for small screen sizes */
  abbreviation?: InputMaybe<Scalars['String']>;
  /** Marker Color */
  color?: Scalars['String'];
  /** Marker Descritpion */
  description?: Scalars['String'];
  /** Marker Icon */
  icon?: InputMaybe<Scalars['String']>;
  /** Marker Name */
  name: Scalars['String'];
  /** Marker Type */
  type: MarkerType;
  /** Marker Value Range From */
  valueRangeFrom?: InputMaybe<Scalars['Int']>;
  /** Marker Value Range To */
  valueRangeTo?: InputMaybe<Scalars['Int']>;
};

export type CreateMediaInput = {
  file: Scalars['Upload'];
};

export type CreateSessionInput = {
  description?: InputMaybe<Scalars['String']>;
  displaySampleSolution?: InputMaybe<Scalars['Boolean']>;
  editable?: InputMaybe<Scalars['Boolean']>;
  enableLiveAnalysis?: InputMaybe<Scalars['Boolean']>;
  enablePlayer?: InputMaybe<Scalars['Boolean']>;
  end?: InputMaybe<Scalars['DateTime']>;
  /** Assigned Media */
  mediaId?: InputMaybe<Scalars['Int']>;
  name: Scalars['String'];
  start?: InputMaybe<Scalars['DateTime']>;
  status?: SessionStatus;
};

export type CreateUserInput = {
  /** User Email */
  email?: InputMaybe<Scalars['String']>;
};

export type CreateUserSessionInput = {
  /** User Session Note */
  note?: Scalars['String'];
  /** User Assopciated to the User Session */
  owner?: InputMaybe<CreateUserInput>;
  /** Associated Session */
  sessionId: Scalars['Int'];
};

export type InviteUserSessionInput = {
  /** User Session Email */
  message?: InputMaybe<Scalars['String']>;
  /** Associated Session */
  userSessionIds: Array<Scalars['ID']>;
};

export type Marker = {
  __typename?: 'Marker';
  /** Marker Name Abbreviation (e.g. for small screen sizes */
  abbreviation?: Maybe<Scalars['String']>;
  /** Marker Color */
  color: Scalars['String'];
  /** Creation Date */
  createdAt: Scalars['DateTime'];
  /** Marker Description */
  description?: Maybe<Scalars['String']>;
  /** Marker Icon */
  icon?: Maybe<Scalars['String']>;
  /** ID for Marker */
  id: Scalars['Int'];
  /** Marker Name */
  name: Scalars['String'];
  /** Marker Type */
  type: MarkerType;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime'];
  /** Marker Value Range From */
  valueRangeFrom?: Maybe<Scalars['Int']>;
  /** Marker Value Range To */
  valueRangeTo?: Maybe<Scalars['Int']>;
};

export enum MarkerType {
  Event = 'EVENT',
  Range = 'RANGE',
  Slider = 'SLIDER',
}

export type Media = {
  __typename?: 'Media';
  /** Creation Date */
  createdAt: Scalars['DateTime'];
  /** ID for Media */
  id: Scalars['ID'];
  /** Media Mime Type */
  mimeType: Scalars['String'];
  /** Media Name */
  name: Scalars['String'];
  /** Date of Last Update */
  updatedAt: Scalars['DateTime'];
};

export type Mutation = {
  __typename?: 'Mutation';
  authenticateSession: Authentication;
  authenticateUserSession: Authentication;
  createAnnotation: Annotation;
  createMarker: Marker;
  createMedia: Media;
  createSession: Session;
  createUserSession: UserSession;
  inviteUserSession: Array<UserSession>;
  removeAnnotation: Annotation;
  removeMarker: Marker;
  removeSession: Session;
  removeUserSession: UserSession;
  setMarkerVisible: Toolbar;
  setPlayMode: Session;
  setPlayPosition: Session;
  updateAnnotation: Annotation;
  updateMarker: Marker;
  updateSession: Session;
  updateToolbar: Toolbar;
  updateUser: User;
  updateUserSession: UserSession;
};

export type MutationAuthenticateSessionArgs = {
  authenticateSessionInput: AuthenticateSessionInput;
};

export type MutationAuthenticateUserSessionArgs = {
  authenticateUserSessionInput: AuthenticateUserSessionInput;
};

export type MutationCreateAnnotationArgs = {
  createAnnotationInput: CreateAnnotationInput;
};

export type MutationCreateMarkerArgs = {
  createMarkerInput: CreateMarkerInput;
};

export type MutationCreateMediaArgs = {
  createMediaInput: CreateMediaInput;
};

export type MutationCreateSessionArgs = {
  createSessionInput: CreateSessionInput;
};

export type MutationCreateUserSessionArgs = {
  createUserSessionInput: CreateUserSessionInput;
};

export type MutationInviteUserSessionArgs = {
  inviteUserSessionInput: InviteUserSessionInput;
};

export type MutationRemoveAnnotationArgs = {
  id: Scalars['Int'];
};

export type MutationRemoveMarkerArgs = {
  id: Scalars['Int'];
};

export type MutationRemoveSessionArgs = {
  id: Scalars['Int'];
};

export type MutationRemoveUserSessionArgs = {
  id: Scalars['Int'];
};

export type MutationSetMarkerVisibleArgs = {
  id: Scalars['Int'];
  updateToolbarMarkerVisible: SetToolbarMarkerVisibilityInput;
};

export type MutationSetPlayModeArgs = {
  id: Scalars['Int'];
  setPlayModeInput: SetPlayModeInput;
};

export type MutationSetPlayPositionArgs = {
  id: Scalars['Int'];
  setPlayPositionInput: SetPlayPositionInput;
};

export type MutationUpdateAnnotationArgs = {
  id: Scalars['Int'];
  updateAnnotationInput: UpdateAnnotationInput;
};

export type MutationUpdateMarkerArgs = {
  id: Scalars['Int'];
  updateMarkerInput: UpdateMarkerInput;
};

export type MutationUpdateSessionArgs = {
  id: Scalars['Int'];
  updateSessionInput: UpdateSessionInput;
};

export type MutationUpdateToolbarArgs = {
  id: Scalars['Int'];
  updateToolbarInput: UpdateToolbarInput;
};

export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type MutationUpdateUserSessionArgs = {
  id: Scalars['Int'];
  updateUserSessionInput: UpdateUserSessionInput;
};

export enum PlayMode {
  Paused = 'PAUSED',
  Running = 'RUNNING',
}

export type Query = {
  __typename?: 'Query';
  annotation: Annotation;
  marker: Marker;
  markers: Array<Marker>;
  me: User;
  session: Session;
  sessionByCode: Session;
  sessions: Array<Session>;
  userSession: UserSession;
  userSessions: Array<UserSession>;
};

export type QueryAnnotationArgs = {
  id: Scalars['Int'];
};

export type QueryMarkerArgs = {
  id: Scalars['Int'];
};

export type QueryMarkersArgs = {
  ids?: InputMaybe<Array<Scalars['Int']>>;
};

export type QuerySessionArgs = {
  id: Scalars['Int'];
};

export type QuerySessionByCodeArgs = {
  code: Scalars['String'];
};

export type QueryUserSessionArgs = {
  id: Scalars['Int'];
};

export type Session = {
  __typename?: 'Session';
  code: Scalars['String'];
  /** Creation Date */
  createdAt: Scalars['DateTime'];
  currentSessionServerTime: Scalars['Float'];
  /** Description */
  description?: Maybe<Scalars['String']>;
  /** Default for Session - Sample Solution Displayed */
  displaySampleSolution?: Maybe<Scalars['Boolean']>;
  /** Default for Session - Editable for Participants */
  editable?: Maybe<Scalars['Boolean']>;
  /** Default for Session - Annotations are Directly Displayed in Analysis */
  enableLiveAnalysis?: Maybe<Scalars['Boolean']>;
  /** Default for Session - Player Enabled for Participants */
  enablePlayer?: Maybe<Scalars['Boolean']>;
  /** End of Session */
  end?: Maybe<Scalars['DateTime']>;
  /** ID for Session */
  id: Scalars['ID'];
  liveSessionEnd?: Maybe<Scalars['Float']>;
  liveSessionStart?: Maybe<Scalars['Float']>;
  /** Associated Media File */
  media?: Maybe<Media>;
  /** Session Name */
  name: Scalars['String'];
  /** Associated User */
  owner: User;
  /** Play Mode */
  playMode?: Maybe<PlayMode>;
  playPosition?: Maybe<Scalars['Float']>;
  /** Start of Session */
  start?: Maybe<Scalars['DateTime']>;
  /** Session Status */
  status?: Maybe<SessionStatus>;
  /** Associated Toolbars */
  toolbars: Array<Toolbar>;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime'];
  /** Associated User Sessions */
  userSessions: Array<UserSession>;
};

export enum SessionStatus {
  Closed = 'CLOSED',
  Open = 'OPEN',
}

export type SetPlayModeInput = {
  playMode?: PlayMode;
};

export type SetPlayPositionInput = {
  playPosition: Scalars['Float'];
};

export type SetToolbarMarkerVisibilityInput = {
  markerId: Scalars['ID'];
  visible: Scalars['Boolean'];
};

export type Subscription = {
  __typename?: 'Subscription';
  sessionUpdated: Session;
  toolbarUpdated: Toolbar;
};

export type SubscriptionSessionUpdatedArgs = {
  id: Scalars['ID'];
};

export type SubscriptionToolbarUpdatedArgs = {
  id: Scalars['ID'];
};

export type Toolbar = {
  __typename?: 'Toolbar';
  /** Creation Date */
  createdAt: Scalars['DateTime'];
  /** ID for Media */
  id: Scalars['ID'];
  markers?: Maybe<Array<ToolbarMarker>>;
  /** Associated Session */
  session: Session;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime'];
};

export type ToolbarMarker = {
  __typename?: 'ToolbarMarker';
  /** Marker ID */
  markerId: Scalars['ID'];
  visible: Scalars['Boolean'];
};

export type UpdateAnnotationInput = {
  /** Annotation Note */
  note?: InputMaybe<Scalars['String']>;
  /** Annotation Value */
  value?: InputMaybe<Scalars['Int']>;
};

export type UpdateMarkerInput = {
  /** Marker Name Abbreviation (e.g. for small screen sizes */
  abbreviation?: InputMaybe<Scalars['String']>;
  /** Marker Color */
  color?: InputMaybe<Scalars['String']>;
  /** Marker Descritpion */
  description?: InputMaybe<Scalars['String']>;
  /** Marker Icon */
  icon?: InputMaybe<Scalars['String']>;
  /** Marker Name */
  name?: InputMaybe<Scalars['String']>;
  /** Marker Type */
  type?: InputMaybe<MarkerType>;
  /** Marker Value Range From */
  valueRangeFrom?: InputMaybe<Scalars['Int']>;
  /** Marker Value Range To */
  valueRangeTo?: InputMaybe<Scalars['Int']>;
};

export type UpdateSessionInput = {
  description?: InputMaybe<Scalars['String']>;
  displaySampleSolution?: InputMaybe<Scalars['Boolean']>;
  editable?: InputMaybe<Scalars['Boolean']>;
  enableLiveAnalysis?: InputMaybe<Scalars['Boolean']>;
  enablePlayer?: InputMaybe<Scalars['Boolean']>;
  end?: InputMaybe<Scalars['DateTime']>;
  liveSessionStart?: InputMaybe<Scalars['Float']>;
  /** Assigned Media */
  mediaId?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['DateTime']>;
  status?: InputMaybe<SessionStatus>;
};

export type UpdateToolbarInput = {
  markers?: Array<Scalars['String']>;
};

export type UpdateUserInput = {
  /** User Displayname */
  displayName?: InputMaybe<Scalars['String']>;
};

export type UpdateUserSessionInput = {
  /** User Session Note */
  note?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  /** Creation Date */
  createdAt: Scalars['DateTime'];
  /** User Display Name */
  displayName?: Maybe<Scalars['String']>;
  /** User Email */
  email?: Maybe<Scalars['String']>;
  /** ID for User */
  id: Scalars['ID'];
  /** Date of Last Update */
  updatedAt: Scalars['DateTime'];
};

export type UserSession = {
  __typename?: 'UserSession';
  /** Associated Annotations */
  annotations: Array<Annotation>;
  /** Creation Date */
  createdAt: Scalars['DateTime'];
  /** ID for User Session */
  id: Scalars['Int'];
  /** Invitation Date */
  invitedAt: Scalars['DateTime'];
  /** User Session Note */
  note?: Maybe<Scalars['String']>;
  /** Associated User */
  owner: User;
  /** Associated Session */
  session: Session;
  /** User Session Status */
  status: UserSessionStatus;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime'];
};

export enum UserSessionStatus {
  Initial = 'INITIAL',
  Started = 'STARTED',
  Submitted = 'SUBMITTED',
}

export type CreateNewSessionMutationVariables = Exact<{
  session: CreateSessionInput;
}>;

export type CreateNewSessionMutation = {
  __typename?: 'Mutation';
  createSession: {
    __typename?: 'Session';
    id: string;
    name: string;
    description?: string | null;
    status?: SessionStatus | null;
    start?: any | null;
    end?: any | null;
    editable?: boolean | null;
    enablePlayer?: boolean | null;
    displaySampleSolution?: boolean | null;
    enableLiveAnalysis?: boolean | null;
    playMode?: PlayMode | null;
    playPosition?: number | null;
    liveSessionStart?: number | null;
    code: string;
    createdAt: any;
    updatedAt: any;
    media?: { __typename?: 'Media'; id: string; name: string; mimeType: string; createdAt: any; updatedAt: any } | null;
    toolbars: Array<{
      __typename?: 'Toolbar';
      id: string;
      createdAt: any;
      updatedAt: any;
      markers?: Array<{ __typename?: 'ToolbarMarker'; markerId: string; visible: boolean }> | null;
    }>;
  };
};

export type UpdateSessionMutationVariables = Exact<{
  id: Scalars['Int'];
  session: UpdateSessionInput;
}>;

export type UpdateSessionMutation = {
  __typename?: 'Mutation';
  updateSession: {
    __typename?: 'Session';
    name: string;
    description?: string | null;
    status?: SessionStatus | null;
    start?: any | null;
    end?: any | null;
    editable?: boolean | null;
    enablePlayer?: boolean | null;
    displaySampleSolution?: boolean | null;
    enableLiveAnalysis?: boolean | null;
    code: string;
    createdAt: any;
    updatedAt: any;
    media?: { __typename?: 'Media'; id: string; name: string; mimeType: string; createdAt: any; updatedAt: any } | null;
  };
};

export type DeleteSessionMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type DeleteSessionMutation = { __typename?: 'Mutation'; removeSession: { __typename?: 'Session'; id: string } };

export type DeleteAnnotationMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type DeleteAnnotationMutation = {
  __typename?: 'Mutation';
  removeAnnotation: { __typename?: 'Annotation'; id: number };
};

export type CreateMediaMutationVariables = Exact<{
  media: CreateMediaInput;
}>;

export type CreateMediaMutation = { __typename?: 'Mutation'; createMedia: { __typename?: 'Media'; id: string } };

export type CreateMarkerMutationVariables = Exact<{
  createMarker: CreateMarkerInput;
}>;

export type CreateMarkerMutation = {
  __typename?: 'Mutation';
  createMarker: { __typename?: 'Marker'; id: number; type: MarkerType; name: string; color: string };
};

export type UpdateToolbarMutationVariables = Exact<{
  id: Scalars['Int'];
  updateToolbarInput: UpdateToolbarInput;
}>;

export type UpdateToolbarMutation = {
  __typename?: 'Mutation';
  updateToolbar: {
    __typename?: 'Toolbar';
    id: string;
    markers?: Array<{ __typename?: 'ToolbarMarker'; markerId: string; visible: boolean }> | null;
  };
};

export type SetMarkerVisibilityInToolbarMutationVariables = Exact<{
  id: Scalars['Int'];
  setToolbarMarkerVisibilityInput: SetToolbarMarkerVisibilityInput;
}>;

export type SetMarkerVisibilityInToolbarMutation = {
  __typename?: 'Mutation';
  setMarkerVisible: {
    __typename?: 'Toolbar';
    id: string;
    markers?: Array<{ __typename?: 'ToolbarMarker'; markerId: string; visible: boolean }> | null;
  };
};

export type AuthenticateSessionCodeMutationVariables = Exact<{
  sessionCode: Scalars['String'];
}>;

export type AuthenticateSessionCodeMutation = {
  __typename?: 'Mutation';
  authenticateUserSession: { __typename?: 'Authentication'; accessToken: string };
};

export type CreateUserSessionMutationVariables = Exact<{
  sessionId: Scalars['Int'];
  email: Scalars['String'];
}>;

export type CreateUserSessionMutation = {
  __typename?: 'Mutation';
  createUserSession: { __typename?: 'UserSession'; id: number; owner: { __typename?: 'User'; email?: string | null } };
};

export type InviteParticipantsMutationVariables = Exact<{
  userSessionIds: Array<Scalars['ID']> | Scalars['ID'];
  message: Scalars['String'];
}>;

export type InviteParticipantsMutation = {
  __typename?: 'Mutation';
  inviteUserSession: Array<{ __typename?: 'UserSession'; status: UserSessionStatus; invitedAt: any }>;
};

export type RemoveUserSessionMutationVariables = Exact<{
  userSessionId: Scalars['Int'];
}>;

export type RemoveUserSessionMutation = {
  __typename?: 'Mutation';
  removeUserSession: { __typename?: 'UserSession'; id: number };
};

export type UpdateUserMutationVariables = Exact<{
  displayName: Scalars['String'];
}>;

export type UpdateUserMutation = {
  __typename?: 'Mutation';
  updateUser: { __typename?: 'User'; id: string; displayName?: string | null };
};

export type CreateAnnotationMutationVariables = Exact<{
  createAnnotation: CreateAnnotationInput;
}>;

export type CreateAnnotationMutation = {
  __typename?: 'Mutation';
  createAnnotation: {
    __typename?: 'Annotation';
    id: number;
    start: number;
    end?: number | null;
    value?: number | null;
    marker: { __typename?: 'Marker'; id: number };
    userSession: { __typename?: 'UserSession'; id: number };
  };
};

export type SetPlayModeMutationVariables = Exact<{
  sessionId: Scalars['Int'];
  setPlayModeInput: SetPlayModeInput;
}>;

export type SetPlayModeMutation = {
  __typename?: 'Mutation';
  setPlayMode: {
    __typename?: 'Session';
    id: string;
    name: string;
    description?: string | null;
    status?: SessionStatus | null;
    start?: any | null;
    end?: any | null;
    editable?: boolean | null;
    enablePlayer?: boolean | null;
    displaySampleSolution?: boolean | null;
    enableLiveAnalysis?: boolean | null;
    playMode?: PlayMode | null;
    playPosition?: number | null;
    liveSessionStart?: number | null;
    code: string;
    createdAt: any;
    updatedAt: any;
    media?: { __typename?: 'Media'; id: string; name: string; mimeType: string; createdAt: any; updatedAt: any } | null;
    toolbars: Array<{
      __typename?: 'Toolbar';
      id: string;
      createdAt: any;
      updatedAt: any;
      markers?: Array<{ __typename?: 'ToolbarMarker'; markerId: string; visible: boolean }> | null;
    }>;
    userSessions: Array<{
      __typename?: 'UserSession';
      id: number;
      owner: { __typename?: 'User'; id: string; email?: string | null };
      annotations: Array<{
        __typename?: 'Annotation';
        id: number;
        end?: number | null;
        start: number;
        value?: number | null;
        marker: { __typename?: 'Marker'; id: number; color: string };
      }>;
    }>;
    owner: { __typename?: 'User'; id: string; createdAt: any; updatedAt: any };
  };
};

export type SetPlayPositionMutationVariables = Exact<{
  sessionId: Scalars['Int'];
  setPlayPositionInput: SetPlayPositionInput;
}>;

export type SetPlayPositionMutation = {
  __typename?: 'Mutation';
  setPlayPosition: {
    __typename?: 'Session';
    id: string;
    name: string;
    description?: string | null;
    status?: SessionStatus | null;
    start?: any | null;
    end?: any | null;
    editable?: boolean | null;
    enablePlayer?: boolean | null;
    displaySampleSolution?: boolean | null;
    enableLiveAnalysis?: boolean | null;
    playMode?: PlayMode | null;
    playPosition?: number | null;
    liveSessionStart?: number | null;
    code: string;
    createdAt: any;
    updatedAt: any;
    media?: { __typename?: 'Media'; id: string; name: string; mimeType: string; createdAt: any; updatedAt: any } | null;
    toolbars: Array<{
      __typename?: 'Toolbar';
      id: string;
      createdAt: any;
      updatedAt: any;
      markers?: Array<{ __typename?: 'ToolbarMarker'; markerId: string; visible: boolean }> | null;
    }>;
    userSessions: Array<{
      __typename?: 'UserSession';
      id: number;
      owner: { __typename?: 'User'; id: string; email?: string | null };
      annotations: Array<{
        __typename?: 'Annotation';
        id: number;
        end?: number | null;
        start: number;
        value?: number | null;
        marker: { __typename?: 'Marker'; id: number; color: string };
      }>;
    }>;
    owner: { __typename?: 'User'; id: string; createdAt: any; updatedAt: any };
  };
};

export type GetSessionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetSessionsQuery = {
  __typename?: 'Query';
  sessions: Array<{
    __typename?: 'Session';
    id: string;
    name: string;
    description?: string | null;
    status?: SessionStatus | null;
    start?: any | null;
    end?: any | null;
    editable?: boolean | null;
    enablePlayer?: boolean | null;
    displaySampleSolution?: boolean | null;
    enableLiveAnalysis?: boolean | null;
    playMode?: PlayMode | null;
    playPosition?: number | null;
    liveSessionStart?: number | null;
    liveSessionEnd?: number | null;
    currentSessionServerTime: number;
    code: string;
    createdAt: any;
    updatedAt: any;
    userSessions: Array<{
      __typename?: 'UserSession';
      id: number;
      owner: { __typename?: 'User'; id: string; email?: string | null; displayName?: string | null };
    }>;
    media?: { __typename?: 'Media'; id: string; name: string; mimeType: string; createdAt: any; updatedAt: any } | null;
    toolbars: Array<{
      __typename?: 'Toolbar';
      id: string;
      createdAt: any;
      updatedAt: any;
      markers?: Array<{ __typename?: 'ToolbarMarker'; markerId: string; visible: boolean }> | null;
    }>;
    owner: { __typename?: 'User'; id: string; createdAt: any; updatedAt: any };
  }>;
};

export type GetOneSessionQueryVariables = Exact<{
  sessionId: Scalars['Int'];
}>;

export type GetOneSessionQuery = {
  __typename?: 'Query';
  session: {
    __typename?: 'Session';
    id: string;
    name: string;
    description?: string | null;
    status?: SessionStatus | null;
    start?: any | null;
    end?: any | null;
    editable?: boolean | null;
    enablePlayer?: boolean | null;
    displaySampleSolution?: boolean | null;
    enableLiveAnalysis?: boolean | null;
    playMode?: PlayMode | null;
    playPosition?: number | null;
    liveSessionStart?: number | null;
    liveSessionEnd?: number | null;
    currentSessionServerTime: number;
    code: string;
    createdAt: any;
    updatedAt: any;
    media?: { __typename?: 'Media'; id: string; name: string; mimeType: string; createdAt: any; updatedAt: any } | null;
    toolbars: Array<{
      __typename?: 'Toolbar';
      id: string;
      createdAt: any;
      updatedAt: any;
      markers?: Array<{ __typename?: 'ToolbarMarker'; markerId: string; visible: boolean }> | null;
    }>;
    userSessions: Array<{
      __typename?: 'UserSession';
      id: number;
      owner: { __typename?: 'User'; id: string; email?: string | null; displayName?: string | null };
      annotations: Array<{
        __typename?: 'Annotation';
        id: number;
        end?: number | null;
        start: number;
        value?: number | null;
        marker: { __typename?: 'Marker'; id: number; color: string };
      }>;
    }>;
    owner: { __typename?: 'User'; id: string; createdAt: any; updatedAt: any };
  };
};

export type GetOneSessionBySessionCodeQueryVariables = Exact<{
  code: Scalars['String'];
}>;

export type GetOneSessionBySessionCodeQuery = {
  __typename?: 'Query';
  sessionByCode: { __typename?: 'Session'; id: string };
};

export type GetMarkersQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['Int']> | Scalars['Int']>;
}>;

export type GetMarkersQuery = {
  __typename?: 'Query';
  markers: Array<{
    __typename?: 'Marker';
    id: number;
    name: string;
    abbreviation?: string | null;
    description?: string | null;
    color: string;
    icon?: string | null;
    createdAt: any;
    updatedAt: any;
    type: MarkerType;
    valueRangeFrom?: number | null;
    valueRangeTo?: number | null;
  }>;
};

export type GetUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserQuery = {
  __typename?: 'Query';
  me: { __typename?: 'User'; id: string; displayName?: string | null; email?: string | null };
};

export type OnSessionUpdatedSubscriptionVariables = Exact<{
  sessionId: Scalars['ID'];
}>;

export type OnSessionUpdatedSubscription = {
  __typename?: 'Subscription';
  sessionUpdated: {
    __typename?: 'Session';
    id: string;
    name: string;
    description?: string | null;
    status?: SessionStatus | null;
    start?: any | null;
    end?: any | null;
    editable?: boolean | null;
    enablePlayer?: boolean | null;
    displaySampleSolution?: boolean | null;
    enableLiveAnalysis?: boolean | null;
    playMode?: PlayMode | null;
    playPosition?: number | null;
    liveSessionStart?: number | null;
    liveSessionEnd?: number | null;
    currentSessionServerTime: number;
    toolbars: Array<{
      __typename?: 'Toolbar';
      id: string;
      createdAt: any;
      updatedAt: any;
      markers?: Array<{ __typename?: 'ToolbarMarker'; markerId: string; visible: boolean }> | null;
    }>;
    userSessions: Array<{
      __typename?: 'UserSession';
      id: number;
      owner: { __typename?: 'User'; id: string; email?: string | null; displayName?: string | null };
    }>;
  };
};

export type OnToolbarUpdatedSubscriptionVariables = Exact<{
  toolbarId: Scalars['ID'];
}>;

export type OnToolbarUpdatedSubscription = {
  __typename?: 'Subscription';
  toolbarUpdated: {
    __typename?: 'Toolbar';
    id: string;
    createdAt: any;
    updatedAt: any;
    markers?: Array<{ __typename?: 'ToolbarMarker'; markerId: string; visible: boolean }> | null;
  };
};

export const CreateNewSessionDocument = gql`
  mutation createNewSession($session: CreateSessionInput!) {
    createSession(createSessionInput: $session) {
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
      liveSessionStart
      code
      media {
        id
        name
        mimeType
        createdAt
        updatedAt
      }
      toolbars {
        id
        markers {
          markerId
          visible
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateNewSessionGQL extends Apollo.Mutation<CreateNewSessionMutation, CreateNewSessionMutationVariables> {
  override document = CreateNewSessionDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateSessionDocument = gql`
  mutation updateSession($id: Int!, $session: UpdateSessionInput!) {
    updateSession(id: $id, updateSessionInput: $session) {
      name
      description
      status
      start
      end
      editable
      enablePlayer
      displaySampleSolution
      enableLiveAnalysis
      code
      media {
        id
        name
        mimeType
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateSessionGQL extends Apollo.Mutation<UpdateSessionMutation, UpdateSessionMutationVariables> {
  override document = UpdateSessionDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteSessionDocument = gql`
  mutation deleteSession($id: Int!) {
    removeSession(id: $id) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteSessionGQL extends Apollo.Mutation<DeleteSessionMutation, DeleteSessionMutationVariables> {
  override document = DeleteSessionDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const DeleteAnnotationDocument = gql`
  mutation deleteAnnotation($id: Int!) {
    removeAnnotation(id: $id) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class DeleteAnnotationGQL extends Apollo.Mutation<DeleteAnnotationMutation, DeleteAnnotationMutationVariables> {
  override document = DeleteAnnotationDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateMediaDocument = gql`
  mutation createMedia($media: CreateMediaInput!) {
    createMedia(createMediaInput: $media) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateMediaGQL extends Apollo.Mutation<CreateMediaMutation, CreateMediaMutationVariables> {
  override document = CreateMediaDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateMarkerDocument = gql`
  mutation createMarker($createMarker: CreateMarkerInput!) {
    createMarker(createMarkerInput: $createMarker) {
      id
      type
      name
      color
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateMarkerGQL extends Apollo.Mutation<CreateMarkerMutation, CreateMarkerMutationVariables> {
  override document = CreateMarkerDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateToolbarDocument = gql`
  mutation updateToolbar($id: Int!, $updateToolbarInput: UpdateToolbarInput!) {
    updateToolbar(id: $id, updateToolbarInput: $updateToolbarInput) {
      id
      markers {
        markerId
        visible
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateToolbarGQL extends Apollo.Mutation<UpdateToolbarMutation, UpdateToolbarMutationVariables> {
  override document = UpdateToolbarDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SetMarkerVisibilityInToolbarDocument = gql`
  mutation setMarkerVisibilityInToolbar($id: Int!, $setToolbarMarkerVisibilityInput: SetToolbarMarkerVisibilityInput!) {
    setMarkerVisible(id: $id, updateToolbarMarkerVisible: $setToolbarMarkerVisibilityInput) {
      id
      markers {
        markerId
        visible
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SetMarkerVisibilityInToolbarGQL extends Apollo.Mutation<
  SetMarkerVisibilityInToolbarMutation,
  SetMarkerVisibilityInToolbarMutationVariables
> {
  override document = SetMarkerVisibilityInToolbarDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const AuthenticateSessionCodeDocument = gql`
  mutation authenticateSessionCode($sessionCode: String!) {
    authenticateUserSession(authenticateUserSessionInput: { code: $sessionCode }) {
      accessToken
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AuthenticateSessionCodeGQL extends Apollo.Mutation<
  AuthenticateSessionCodeMutation,
  AuthenticateSessionCodeMutationVariables
> {
  override document = AuthenticateSessionCodeDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateUserSessionDocument = gql`
  mutation createUserSession($sessionId: Int!, $email: String!) {
    createUserSession(createUserSessionInput: { sessionId: $sessionId, owner: { email: $email } }) {
      id
      owner {
        email
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateUserSessionGQL extends Apollo.Mutation<
  CreateUserSessionMutation,
  CreateUserSessionMutationVariables
> {
  override document = CreateUserSessionDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const InviteParticipantsDocument = gql`
  mutation inviteParticipants($userSessionIds: [ID!]!, $message: String!) {
    inviteUserSession(inviteUserSessionInput: { userSessionIds: $userSessionIds, message: $message }) {
      status
      invitedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class InviteParticipantsGQL extends Apollo.Mutation<
  InviteParticipantsMutation,
  InviteParticipantsMutationVariables
> {
  override document = InviteParticipantsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RemoveUserSessionDocument = gql`
  mutation removeUserSession($userSessionId: Int!) {
    removeUserSession(id: $userSessionId) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RemoveUserSessionGQL extends Apollo.Mutation<
  RemoveUserSessionMutation,
  RemoveUserSessionMutationVariables
> {
  override document = RemoveUserSessionDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateUserDocument = gql`
  mutation updateUser($displayName: String!) {
    updateUser(updateUserInput: { displayName: $displayName }) {
      id
      displayName
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateUserGQL extends Apollo.Mutation<UpdateUserMutation, UpdateUserMutationVariables> {
  override document = UpdateUserDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateAnnotationDocument = gql`
  mutation createAnnotation($createAnnotation: CreateAnnotationInput!) {
    createAnnotation(createAnnotationInput: $createAnnotation) {
      id
      marker {
        id
      }
      userSession {
        id
      }
      start
      end
      value
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateAnnotationGQL extends Apollo.Mutation<CreateAnnotationMutation, CreateAnnotationMutationVariables> {
  override document = CreateAnnotationDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SetPlayModeDocument = gql`
  mutation setPlayMode($sessionId: Int!, $setPlayModeInput: SetPlayModeInput!) {
    setPlayMode(id: $sessionId, setPlayModeInput: $setPlayModeInput) {
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
      liveSessionStart
      code
      media {
        id
        name
        mimeType
        createdAt
        updatedAt
      }
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
          id
          email
        }
        annotations {
          id
          end
          start
          value
          marker {
            id
            color
          }
        }
      }
      owner {
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SetPlayModeGQL extends Apollo.Mutation<SetPlayModeMutation, SetPlayModeMutationVariables> {
  override document = SetPlayModeDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SetPlayPositionDocument = gql`
  mutation setPlayPosition($sessionId: Int!, $setPlayPositionInput: SetPlayPositionInput!) {
    setPlayPosition(id: $sessionId, setPlayPositionInput: $setPlayPositionInput) {
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
      liveSessionStart
      code
      media {
        id
        name
        mimeType
        createdAt
        updatedAt
      }
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
          id
          email
        }
        annotations {
          id
          end
          start
          value
          marker {
            id
            color
          }
        }
      }
      owner {
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class SetPlayPositionGQL extends Apollo.Mutation<SetPlayPositionMutation, SetPlayPositionMutationVariables> {
  override document = SetPlayPositionDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetSessionsDocument = gql`
  query GetSessions {
    sessions {
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
      liveSessionStart
      liveSessionEnd
      currentSessionServerTime
      code
      userSessions {
        id
        owner {
          id
          email
          displayName
        }
      }
      media {
        id
        name
        mimeType
        createdAt
        updatedAt
      }
      toolbars {
        id
        markers {
          markerId
          visible
        }
        createdAt
        updatedAt
      }
      owner {
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetSessionsGQL extends Apollo.Query<GetSessionsQuery, GetSessionsQueryVariables> {
  override document = GetSessionsDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetOneSessionDocument = gql`
  query GetOneSession($sessionId: Int!) {
    session(id: $sessionId) {
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
      liveSessionStart
      liveSessionEnd
      currentSessionServerTime
      code
      media {
        id
        name
        mimeType
        createdAt
        updatedAt
      }
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
          id
          email
          displayName
        }
        annotations {
          id
          end
          start
          value
          marker {
            id
            color
          }
        }
      }
      owner {
        id
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetOneSessionGQL extends Apollo.Query<GetOneSessionQuery, GetOneSessionQueryVariables> {
  override document = GetOneSessionDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetOneSessionBySessionCodeDocument = gql`
  query GetOneSessionBySessionCode($code: String!) {
    sessionByCode(code: $code) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetOneSessionBySessionCodeGQL extends Apollo.Query<
  GetOneSessionBySessionCodeQuery,
  GetOneSessionBySessionCodeQueryVariables
> {
  override document = GetOneSessionBySessionCodeDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetMarkersDocument = gql`
  query GetMarkers($ids: [Int!]) {
    markers(ids: $ids) {
      id
      name
      abbreviation
      description
      color
      icon
      createdAt
      updatedAt
      type
      valueRangeFrom
      valueRangeTo
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetMarkersGQL extends Apollo.Query<GetMarkersQuery, GetMarkersQueryVariables> {
  override document = GetMarkersDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const GetUserDocument = gql`
  query getUser {
    me {
      id
      displayName
      email
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class GetUserGQL extends Apollo.Query<GetUserQuery, GetUserQueryVariables> {
  override document = GetUserDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const OnSessionUpdatedDocument = gql`
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
      liveSessionStart
      liveSessionEnd
      currentSessionServerTime
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
          id
          email
          displayName
        }
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class OnSessionUpdatedGQL extends Apollo.Subscription<
  OnSessionUpdatedSubscription,
  OnSessionUpdatedSubscriptionVariables
> {
  override document = OnSessionUpdatedDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const OnToolbarUpdatedDocument = gql`
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

@Injectable({
  providedIn: 'root',
})
export class OnToolbarUpdatedGQL extends Apollo.Subscription<
  OnToolbarUpdatedSubscription,
  OnToolbarUpdatedSubscriptionVariables
> {
  override document = OnToolbarUpdatedDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
