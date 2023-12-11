import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any };
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any };
};

export type Annotation = {
  __typename?: 'Annotation';
  /** Associated Comments */
  comments: Array<Comment>;
  /** Creation Date */
  createdAt: Scalars['DateTime']['output'];
  /** Annotation End Seconds */
  end?: Maybe<Scalars['Int']['output']>;
  /** ID for Annotation */
  id: Scalars['Int']['output'];
  /** Associated Marker */
  marker: Marker;
  /** Associated Media File */
  media?: Maybe<Media>;
  /** Annotation Note */
  note?: Maybe<Scalars['String']['output']>;
  /** Annotation Start Seconds */
  start: Scalars['Int']['output'];
  /** Date of Last Update */
  updatedAt: Scalars['DateTime']['output'];
  /** Associated UserSession */
  userSession: UserSession;
  /** Annotation Value */
  value?: Maybe<Scalars['Int']['output']>;
};

export type AuthenticateSessionInput = {
  /** Session Code */
  code: Scalars['String']['input'];
};

export type AuthenticateUserSessionInput = {
  /** User Session Code */
  code: Scalars['String']['input'];
};

export type Authentication = {
  __typename?: 'Authentication';
  /** JWT Bearer Token */
  accessToken: Scalars['String']['output'];
  /** Authenticated user */
  user: User;
};

export type Comment = {
  __typename?: 'Comment';
  /** Associated Annotation */
  annotation: Annotation;
  /** Creation Date */
  createdAt: Scalars['DateTime']['output'];
  /** ID for Comment */
  id: Scalars['Int']['output'];
  /** Associated User */
  owner: User;
  /** Comment Text */
  text: Scalars['String']['output'];
  /** Date of Last Update */
  updatedAt: Scalars['DateTime']['output'];
};

export type CreateAnnotationInput = {
  /** Annotation End Seconds */
  end?: InputMaybe<Scalars['Int']['input']>;
  /** Associated Marker */
  markerId: Scalars['Int']['input'];
  /** Assigned Media */
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  /** Annotation Note */
  note?: InputMaybe<Scalars['String']['input']>;
  /** Annotation Start Seconds */
  start: Scalars['Int']['input'];
  /** Associated User Session */
  userSessionId: Scalars['Int']['input'];
  /** Annotation Value */
  value?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateCommentInput = {
  /** Associated Annotation */
  annotationId: Scalars['Int']['input'];
  /** Comment Text */
  text: Scalars['String']['input'];
};

export type CreateMarkerInput = {
  /** Marker Name Abbreviation (e.g. for small screen sizes */
  abbreviation?: InputMaybe<Scalars['String']['input']>;
  /** Marker Color */
  color?: Scalars['String']['input'];
  /** Marker Content Color */
  contentColor?: Scalars['String']['input'];
  /** Marker Description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Marker Icon */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Marker Name */
  name: Scalars['String']['input'];
  /** Marker Type */
  type: MarkerType;
  /** Marker Value Range From */
  valueRangeFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Marker Value Range To */
  valueRangeTo?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateMediaInput = {
  file: Scalars['Upload']['input'];
};

export type CreateSessionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displaySampleSolution?: InputMaybe<Scalars['Boolean']['input']>;
  editable?: InputMaybe<Scalars['Boolean']['input']>;
  enableLiveAnalysis?: InputMaybe<Scalars['Boolean']['input']>;
  enablePlayer?: InputMaybe<Scalars['Boolean']['input']>;
  end?: InputMaybe<Scalars['DateTime']['input']>;
  lockAnnotationDelete?: InputMaybe<Scalars['Boolean']['input']>;
  /** Assigned Media */
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  start?: InputMaybe<Scalars['DateTime']['input']>;
  status?: SessionStatus;
};

export type CreateUserInput = {
  /** User Email */
  email?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUserSessionInput = {
  /** User Session Note */
  note?: Scalars['String']['input'];
  /** User Assopciated to the User Session */
  owner?: InputMaybe<CreateUserInput>;
  /** Associated Session */
  sessionId: Scalars['Int']['input'];
};

export type InviteUserSessionInput = {
  /** User Session Email */
  message?: InputMaybe<Scalars['String']['input']>;
  /** Associated Session */
  sessionId: Scalars['Int']['input'];
  /** Associated Session */
  userSessionIds: Array<Scalars['ID']['input']>;
};

export type Marker = {
  __typename?: 'Marker';
  /** Marker Name Abbreviation (e.g. for small screen sizes */
  abbreviation?: Maybe<Scalars['String']['output']>;
  /** Marker Color */
  color: Scalars['String']['output'];
  /** Marker Content (Text, Icon, Slider Knob) Color */
  contentColor: Scalars['String']['output'];
  /** Creation Date */
  createdAt: Scalars['DateTime']['output'];
  /** Marker Description */
  description?: Maybe<Scalars['String']['output']>;
  /** Marker Icon */
  icon?: Maybe<Scalars['String']['output']>;
  /** ID for Marker */
  id: Scalars['Int']['output'];
  /** Marker Name */
  name: Scalars['String']['output'];
  /** Associated User */
  owner: User;
  /** Marker Type */
  type: MarkerType;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime']['output'];
  /** Marker Value Range From */
  valueRangeFrom?: Maybe<Scalars['Int']['output']>;
  /** Marker Value Range To */
  valueRangeTo?: Maybe<Scalars['Int']['output']>;
};

export enum MarkerType {
  Event = 'EVENT',
  Range = 'RANGE',
  Slider = 'SLIDER',
}

export type Media = {
  __typename?: 'Media';
  /** Creation Date */
  createdAt: Scalars['DateTime']['output'];
  /** ID for Media */
  id: Scalars['ID']['output'];
  /** Media Mime Type */
  mimeType: Scalars['String']['output'];
  /** Media Name */
  name: Scalars['String']['output'];
  /** Date of Last Update */
  updatedAt: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  authenticateSession: Authentication;
  authenticateUserSession: Authentication;
  createAnnotation: Annotation;
  createComment: Comment;
  createMarker: Marker;
  createMedia: Media;
  createSession: Session;
  createUserSession: UserSession;
  inviteUserSession: Array<UserSession>;
  removeAnnotation: Annotation;
  removeAnnotationMedia: Annotation;
  removeComment: Comment;
  removeMarker: Marker;
  removeSession: Session;
  removeUserSession: UserSession;
  setMarkerVisible: Toolbar;
  setPlayMode: Session;
  setPlayPosition: Session;
  updateAnnotation: Annotation;
  updateComment: Comment;
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

export type MutationCreateCommentArgs = {
  createCommentInput: CreateCommentInput;
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
  id: Scalars['Int']['input'];
};

export type MutationRemoveAnnotationMediaArgs = {
  id: Scalars['Int']['input'];
};

export type MutationRemoveCommentArgs = {
  id: Scalars['Int']['input'];
};

export type MutationRemoveMarkerArgs = {
  id: Scalars['Int']['input'];
};

export type MutationRemoveSessionArgs = {
  id: Scalars['Int']['input'];
};

export type MutationRemoveUserSessionArgs = {
  id: Scalars['Int']['input'];
};

export type MutationSetMarkerVisibleArgs = {
  id: Scalars['Int']['input'];
  updateToolbarMarkerVisible: SetToolbarMarkerVisibilityInput;
};

export type MutationSetPlayModeArgs = {
  id: Scalars['Int']['input'];
  setPlayModeInput: SetPlayModeInput;
};

export type MutationSetPlayPositionArgs = {
  id: Scalars['Int']['input'];
  setPlayPositionInput: SetPlayPositionInput;
};

export type MutationUpdateAnnotationArgs = {
  id: Scalars['Int']['input'];
  updateAnnotationInput: UpdateAnnotationInput;
};

export type MutationUpdateCommentArgs = {
  id: Scalars['Int']['input'];
  updateCommentInput: UpdateCommentInput;
};

export type MutationUpdateMarkerArgs = {
  id: Scalars['Int']['input'];
  updateMarkerInput: UpdateMarkerInput;
};

export type MutationUpdateSessionArgs = {
  id: Scalars['Int']['input'];
  updateSessionInput: UpdateSessionInput;
};

export type MutationUpdateToolbarArgs = {
  id: Scalars['Int']['input'];
  updateToolbarInput: UpdateToolbarInput;
};

export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type MutationUpdateUserSessionArgs = {
  id: Scalars['Int']['input'];
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
  id: Scalars['Int']['input'];
};

export type QueryMarkerArgs = {
  id: Scalars['Int']['input'];
};

export type QueryMarkersArgs = {
  ids?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type QuerySessionArgs = {
  id: Scalars['Int']['input'];
};

export type QuerySessionByCodeArgs = {
  code: Scalars['String']['input'];
};

export type QueryUserSessionArgs = {
  id: Scalars['Int']['input'];
};

export enum Role {
  Guest = 'GUEST',
  User = 'USER',
}

export type Session = {
  __typename?: 'Session';
  code: Scalars['String']['output'];
  /** Creation Date */
  createdAt: Scalars['DateTime']['output'];
  currentSessionServerTime: Scalars['Float']['output'];
  /** Description */
  description?: Maybe<Scalars['String']['output']>;
  /** Default for Session - Sample Solution Displayed */
  displaySampleSolution?: Maybe<Scalars['Boolean']['output']>;
  /** Default for Session - Editable for Participants */
  editable?: Maybe<Scalars['Boolean']['output']>;
  /** Default for Session - Annotations are Directly Displayed in Analysis */
  enableLiveAnalysis?: Maybe<Scalars['Boolean']['output']>;
  /** Default for Session - Player Enabled for Participants */
  enablePlayer?: Maybe<Scalars['Boolean']['output']>;
  /** End of Session */
  end?: Maybe<Scalars['DateTime']['output']>;
  /** ID for Session */
  id: Scalars['ID']['output'];
  isAudioSession: Scalars['Boolean']['output'];
  isSessionOwner: Scalars['Boolean']['output'];
  liveSessionEnd?: Maybe<Scalars['Float']['output']>;
  liveSessionStart?: Maybe<Scalars['Float']['output']>;
  /** Default for Session - Are Participants Allowed to Delete Their Own Annotations */
  lockAnnotationDelete?: Maybe<Scalars['Boolean']['output']>;
  /** Associated Media File */
  media?: Maybe<Media>;
  /** Session Name */
  name: Scalars['String']['output'];
  /** Associated User */
  owner: User;
  /** Play Mode */
  playMode?: Maybe<PlayMode>;
  playPosition?: Maybe<Scalars['Float']['output']>;
  /** Start of Session */
  start?: Maybe<Scalars['DateTime']['output']>;
  /** Session Status */
  status?: Maybe<SessionStatus>;
  /** Associated Toolbars */
  toolbars: Array<Toolbar>;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime']['output'];
  /** Associated User Sessions */
  userSessions: Array<UserSession>;
};

export enum SessionStatus {
  Archived = 'ARCHIVED',
  Closed = 'CLOSED',
  InPreparation = 'IN_PREPARATION',
  Open = 'OPEN',
}

export type SetPlayModeInput = {
  playMode?: PlayMode;
};

export type SetPlayPositionInput = {
  playPosition: Scalars['Float']['input'];
};

export type SetToolbarMarkerVisibilityInput = {
  markerId: Scalars['ID']['input'];
  visible: Scalars['Boolean']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  sessionUpdated: Session;
  toolbarUpdated: Toolbar;
};

export type SubscriptionSessionUpdatedArgs = {
  id: Scalars['ID']['input'];
};

export type SubscriptionToolbarUpdatedArgs = {
  id: Scalars['ID']['input'];
};

export type Toolbar = {
  __typename?: 'Toolbar';
  /** Creation Date */
  createdAt: Scalars['DateTime']['output'];
  /** ID for Media */
  id: Scalars['ID']['output'];
  markers?: Maybe<Array<ToolbarMarker>>;
  /** Associated Session */
  session: Session;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime']['output'];
};

export type ToolbarMarker = {
  __typename?: 'ToolbarMarker';
  /** Marker ID */
  markerId: Scalars['ID']['output'];
  visible: Scalars['Boolean']['output'];
};

export type UpdateAnnotationInput = {
  /** Assigned Media */
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  /** Annotation Note */
  note?: InputMaybe<Scalars['String']['input']>;
  /** Annotation Value */
  value?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateCommentInput = {
  /** Comment Text */
  text?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMarkerInput = {
  /** Marker Name Abbreviation (e.g. for small screen sizes */
  abbreviation?: InputMaybe<Scalars['String']['input']>;
  /** Marker Color */
  color?: InputMaybe<Scalars['String']['input']>;
  /** Marker Content Color */
  contentColor?: InputMaybe<Scalars['String']['input']>;
  /** Marker Description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Marker Icon */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** Marker Name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Marker Type */
  type?: InputMaybe<MarkerType>;
  /** Marker Value Range From */
  valueRangeFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Marker Value Range To */
  valueRangeTo?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateSessionInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  displaySampleSolution?: InputMaybe<Scalars['Boolean']['input']>;
  editable?: InputMaybe<Scalars['Boolean']['input']>;
  enableLiveAnalysis?: InputMaybe<Scalars['Boolean']['input']>;
  enablePlayer?: InputMaybe<Scalars['Boolean']['input']>;
  end?: InputMaybe<Scalars['DateTime']['input']>;
  liveSessionStart?: InputMaybe<Scalars['Float']['input']>;
  lockAnnotationDelete?: InputMaybe<Scalars['Boolean']['input']>;
  /** Assigned Media */
  mediaId?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<SessionStatus>;
};

export type UpdateToolbarInput = {
  markers?: Array<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  /** User Displayname */
  displayName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserSessionInput = {
  /** User Session Note */
  note?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  /** Creation Date */
  createdAt: Scalars['DateTime']['output'];
  /** User Display Name */
  displayName?: Maybe<Scalars['String']['output']>;
  /** User Email */
  email?: Maybe<Scalars['String']['output']>;
  /** ID for User */
  id: Scalars['ID']['output'];
  /** User Role */
  role: Role;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime']['output'];
};

export type UserSession = {
  __typename?: 'UserSession';
  /** Associated Annotations */
  annotations: Array<Annotation>;
  /** Creation Date */
  createdAt: Scalars['DateTime']['output'];
  /** ID for User Session */
  id: Scalars['Int']['output'];
  /** Invitation Date */
  invitedAt: Scalars['DateTime']['output'];
  /** User Session Note */
  note?: Maybe<Scalars['String']['output']>;
  /** Associated User */
  owner: User;
  /** Associated Session */
  session: Session;
  /** User Session Status */
  status: UserSessionStatus;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime']['output'];
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
    lockAnnotationDelete?: boolean | null;
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
  id: Scalars['Int']['input'];
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
    lockAnnotationDelete?: boolean | null;
    code: string;
    createdAt: any;
    updatedAt: any;
    media?: { __typename?: 'Media'; id: string; name: string; mimeType: string; createdAt: any; updatedAt: any } | null;
  };
};

export type DeleteSessionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;

export type DeleteSessionMutation = { __typename?: 'Mutation'; removeSession: { __typename?: 'Session'; id: string } };

export type DeleteAnnotationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
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
  createMarker: {
    __typename?: 'Marker';
    id: number;
    type: MarkerType;
    name: string;
    color: string;
    contentColor: string;
  };
};

export type UpdateToolbarMutationVariables = Exact<{
  id: Scalars['Int']['input'];
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
  id: Scalars['Int']['input'];
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
  sessionCode: Scalars['String']['input'];
}>;

export type AuthenticateSessionCodeMutation = {
  __typename?: 'Mutation';
  authenticateUserSession: { __typename?: 'Authentication'; accessToken: string };
};

export type CreateUserSessionMutationVariables = Exact<{
  sessionId: Scalars['Int']['input'];
  email: Scalars['String']['input'];
}>;

export type CreateUserSessionMutation = {
  __typename?: 'Mutation';
  createUserSession: {
    __typename?: 'UserSession';
    id: number;
    owner: { __typename?: 'User'; role: Role; email?: string | null };
  };
};

export type InviteParticipantsMutationVariables = Exact<{
  sessionId: Scalars['Int']['input'];
  userSessionIds: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  message: Scalars['String']['input'];
}>;

export type InviteParticipantsMutation = {
  __typename?: 'Mutation';
  inviteUserSession: Array<{ __typename?: 'UserSession'; status: UserSessionStatus; invitedAt: any }>;
};

export type RemoveUserSessionMutationVariables = Exact<{
  userSessionId: Scalars['Int']['input'];
}>;

export type RemoveUserSessionMutation = {
  __typename?: 'Mutation';
  removeUserSession: { __typename?: 'UserSession'; id: number };
};

export type UpdateUserMutationVariables = Exact<{
  displayName: Scalars['String']['input'];
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
    marker: { __typename?: 'Marker'; id: number; type: MarkerType; name: string };
    userSession: { __typename?: 'UserSession'; id: number };
  };
};

export type SetPlayModeMutationVariables = Exact<{
  sessionId: Scalars['Int']['input'];
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
    lockAnnotationDelete?: boolean | null;
    playMode?: PlayMode | null;
    isAudioSession: boolean;
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
      owner: { __typename?: 'User'; id: string; email?: string | null; role: Role };
      annotations: Array<{
        __typename?: 'Annotation';
        id: number;
        end?: number | null;
        start: number;
        value?: number | null;
        comments: Array<{
          __typename?: 'Comment';
          id: number;
          text: string;
          createdAt: any;
          owner: { __typename?: 'User'; id: string; role: Role; createdAt: any; updatedAt: any };
        }>;
        media?: { __typename?: 'Media'; id: string } | null;
        marker: {
          __typename?: 'Marker';
          id: number;
          type: MarkerType;
          name: string;
          color: string;
          contentColor: string;
        };
      }>;
    }>;
    owner: { __typename?: 'User'; id: string; role: Role; createdAt: any; updatedAt: any };
  };
};

export type SetPlayPositionMutationVariables = Exact<{
  sessionId: Scalars['Int']['input'];
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
    lockAnnotationDelete?: boolean | null;
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
      owner: { __typename?: 'User'; id: string; email?: string | null; role: Role };
      annotations: Array<{
        __typename?: 'Annotation';
        id: number;
        end?: number | null;
        start: number;
        value?: number | null;
        comments: Array<{
          __typename?: 'Comment';
          id: number;
          text: string;
          createdAt: any;
          owner: { __typename?: 'User'; id: string; role: Role; createdAt: any; updatedAt: any };
        }>;
        media?: { __typename?: 'Media'; id: string } | null;
        marker: {
          __typename?: 'Marker';
          id: number;
          type: MarkerType;
          name: string;
          color: string;
          contentColor: string;
        };
      }>;
    }>;
    owner: { __typename?: 'User'; id: string; role: Role; createdAt: any; updatedAt: any };
  };
};

export type UpdateMarkerMutationVariables = Exact<{
  markerId: Scalars['Int']['input'];
  updateMarkerInput: UpdateMarkerInput;
}>;

export type UpdateMarkerMutation = {
  __typename?: 'Mutation';
  updateMarker: {
    __typename?: 'Marker';
    id: number;
    type: MarkerType;
    name: string;
    abbreviation?: string | null;
    description?: string | null;
    color: string;
    icon?: string | null;
    contentColor: string;
    valueRangeFrom?: number | null;
    valueRangeTo?: number | null;
    createdAt: any;
    updatedAt: any;
    owner: { __typename?: 'User'; id: string; role: Role; createdAt: any; updatedAt: any };
  };
};

export type UpdateAnnotationNoteMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  note: Scalars['String']['input'];
}>;

export type UpdateAnnotationNoteMutation = {
  __typename?: 'Mutation';
  updateAnnotation: { __typename?: 'Annotation'; id: number; note?: string | null };
};

export type UpdateAnnotationAudioMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  mediaId: Scalars['Int']['input'];
}>;

export type UpdateAnnotationAudioMutation = {
  __typename?: 'Mutation';
  updateAnnotation: { __typename?: 'Annotation'; id: number; media?: { __typename?: 'Media'; id: string } | null };
};

export type RemoveAnnotationAudioMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;

export type RemoveAnnotationAudioMutation = {
  __typename?: 'Mutation';
  removeAnnotationMedia: { __typename?: 'Annotation'; id: number };
};

export type CreateAnnotationCommentMutationVariables = Exact<{
  annotationId: Scalars['Int']['input'];
  commentText: Scalars['String']['input'];
}>;

export type CreateAnnotationCommentMutation = {
  __typename?: 'Mutation';
  createComment: {
    __typename?: 'Comment';
    id: number;
    text: string;
    owner: { __typename?: 'User'; id: string; role: Role; createdAt: any; updatedAt: any };
  };
};

export type UpdateAnnotationCommentMutationVariables = Exact<{
  commentId: Scalars['Int']['input'];
  commentText: Scalars['String']['input'];
}>;

export type UpdateAnnotationCommentMutation = {
  __typename?: 'Mutation';
  updateComment: {
    __typename?: 'Comment';
    id: number;
    text: string;
    owner: { __typename?: 'User'; id: string; role: Role; createdAt: any; updatedAt: any };
  };
};

export type RemoveAnnotationCommentMutationVariables = Exact<{
  commentId: Scalars['Int']['input'];
}>;

export type RemoveAnnotationCommentMutation = {
  __typename?: 'Mutation';
  removeComment: { __typename?: 'Comment'; id: number };
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
    lockAnnotationDelete?: boolean | null;
    playMode?: PlayMode | null;
    playPosition?: number | null;
    liveSessionStart?: number | null;
    liveSessionEnd?: number | null;
    currentSessionServerTime: number;
    isSessionOwner: boolean;
    isAudioSession: boolean;
    code: string;
    createdAt: any;
    updatedAt: any;
    userSessions: Array<{
      __typename?: 'UserSession';
      id: number;
      owner: { __typename?: 'User'; id: string; email?: string | null; displayName?: string | null; role: Role };
    }>;
    media?: { __typename?: 'Media'; id: string; name: string; mimeType: string; createdAt: any; updatedAt: any } | null;
    toolbars: Array<{
      __typename?: 'Toolbar';
      id: string;
      createdAt: any;
      updatedAt: any;
      markers?: Array<{ __typename?: 'ToolbarMarker'; markerId: string; visible: boolean }> | null;
    }>;
    owner: { __typename?: 'User'; id: string; role: Role; createdAt: any; updatedAt: any };
  }>;
};

export type GetOneSessionQueryVariables = Exact<{
  sessionId: Scalars['Int']['input'];
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
    lockAnnotationDelete?: boolean | null;
    playMode?: PlayMode | null;
    playPosition?: number | null;
    liveSessionStart?: number | null;
    liveSessionEnd?: number | null;
    currentSessionServerTime: number;
    isSessionOwner: boolean;
    isAudioSession: boolean;
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
      owner: { __typename?: 'User'; id: string; email?: string | null; displayName?: string | null; role: Role };
      annotations: Array<{
        __typename?: 'Annotation';
        id: number;
        end?: number | null;
        start: number;
        value?: number | null;
        comments: Array<{
          __typename?: 'Comment';
          id: number;
          text: string;
          createdAt: any;
          owner: { __typename?: 'User'; id: string; role: Role; createdAt: any; updatedAt: any };
        }>;
        media?: { __typename?: 'Media'; id: string } | null;
        marker: {
          __typename?: 'Marker';
          id: number;
          name: string;
          type: MarkerType;
          color: string;
          contentColor: string;
        };
      }>;
    }>;
    owner: { __typename?: 'User'; id: string; role: Role; createdAt: any; updatedAt: any };
  };
};

export type GetOneSessionBySessionCodeQueryVariables = Exact<{
  code: Scalars['String']['input'];
}>;

export type GetOneSessionBySessionCodeQuery = {
  __typename?: 'Query';
  sessionByCode: { __typename?: 'Session'; id: string };
};

export type GetMarkersQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
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
    contentColor: string;
    icon?: string | null;
    createdAt: any;
    updatedAt: any;
    type: MarkerType;
    valueRangeFrom?: number | null;
    valueRangeTo?: number | null;
    owner: { __typename?: 'User'; id: string; role: Role; createdAt: any; updatedAt: any };
  }>;
};

export type GetUserQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserQuery = {
  __typename?: 'Query';
  me: {
    __typename?: 'User';
    id: string;
    displayName?: string | null;
    email?: string | null;
    role: Role;
    createdAt: any;
    updatedAt: any;
  };
};

export type SessionExportQueryVariables = Exact<{
  sessionId: Scalars['Int']['input'];
}>;

export type SessionExportQuery = {
  __typename?: 'Query';
  session: {
    __typename?: 'Session';
    id: string;
    start?: any | null;
    end?: any | null;
    name: string;
    description?: string | null;
    status?: SessionStatus | null;
    isAudioSession: boolean;
    userSessions: Array<{
      __typename?: 'UserSession';
      id: number;
      status: UserSessionStatus;
      note?: string | null;
      annotations: Array<{
        __typename?: 'Annotation';
        id: number;
        start: number;
        end?: number | null;
        value?: number | null;
        comments: Array<{
          __typename?: 'Comment';
          id: number;
          text: string;
          createdAt: any;
          owner: { __typename?: 'User'; id: string; role: Role; createdAt: any; updatedAt: any };
        }>;
        media?: { __typename?: 'Media'; id: string } | null;
        marker: {
          __typename?: 'Marker';
          id: number;
          type: MarkerType;
          name: string;
          abbreviation?: string | null;
          description?: string | null;
          color: string;
          contentColor: string;
          icon?: string | null;
          valueRangeFrom?: number | null;
          valueRangeTo?: number | null;
        };
      }>;
    }>;
  };
};

export type SessionCsvExportQueryVariables = Exact<{
  sessionId: Scalars['Int']['input'];
}>;

export type SessionCsvExportQuery = {
  __typename?: 'Query';
  session: {
    __typename?: 'Session';
    id: string;
    start?: any | null;
    end?: any | null;
    name: string;
    description?: string | null;
    status?: SessionStatus | null;
    isAudioSession: boolean;
    owner: { __typename?: 'User'; id: string };
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
      status: UserSessionStatus;
      note?: string | null;
      owner: { __typename?: 'User'; id: string };
      annotations: Array<{
        __typename?: 'Annotation';
        id: number;
        start: number;
        end?: number | null;
        value?: number | null;
        media?: { __typename?: 'Media'; id: string } | null;
        marker: {
          __typename?: 'Marker';
          id: number;
          type: MarkerType;
          name: string;
          abbreviation?: string | null;
          description?: string | null;
          color: string;
          contentColor: string;
          icon?: string | null;
          valueRangeFrom?: number | null;
          valueRangeTo?: number | null;
        };
      }>;
    }>;
  };
};

export type OnSessionUpdatedSubscriptionVariables = Exact<{
  sessionId: Scalars['ID']['input'];
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
    lockAnnotationDelete?: boolean | null;
    playMode?: PlayMode | null;
    playPosition?: number | null;
    liveSessionStart?: number | null;
    liveSessionEnd?: number | null;
    currentSessionServerTime: number;
    isSessionOwner: boolean;
    isAudioSession: boolean;
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
  toolbarId: Scalars['ID']['input'];
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
      lockAnnotationDelete
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
      lockAnnotationDelete
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
      contentColor
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
        role
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
  mutation inviteParticipants($sessionId: Int!, $userSessionIds: [ID!]!, $message: String!) {
    inviteUserSession(
      inviteUserSessionInput: { sessionId: $sessionId, userSessionIds: $userSessionIds, message: $message }
    ) {
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
        type
        name
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
      lockAnnotationDelete
      playMode
      isAudioSession
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
          role
        }
        annotations {
          id
          end
          start
          value
          comments {
            id
            text
            createdAt
            owner {
              id
              role
              createdAt
              updatedAt
            }
          }
          media {
            id
          }
          marker {
            id
            type
            name
            color
            contentColor
          }
        }
      }
      owner {
        id
        role
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
      lockAnnotationDelete
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
          role
        }
        annotations {
          id
          end
          start
          value
          comments {
            id
            text
            createdAt
            owner {
              id
              role
              createdAt
              updatedAt
            }
          }
          media {
            id
          }
          marker {
            id
            type
            name
            color
            contentColor
          }
        }
      }
      owner {
        id
        role
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
export const UpdateMarkerDocument = gql`
  mutation updateMarker($markerId: Int!, $updateMarkerInput: UpdateMarkerInput!) {
    updateMarker(id: $markerId, updateMarkerInput: $updateMarkerInput) {
      id
      type
      name
      abbreviation
      description
      color
      icon
      contentColor
      valueRangeFrom
      valueRangeTo
      createdAt
      updatedAt
      owner {
        id
        role
        createdAt
        updatedAt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateMarkerGQL extends Apollo.Mutation<UpdateMarkerMutation, UpdateMarkerMutationVariables> {
  override document = UpdateMarkerDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateAnnotationNoteDocument = gql`
  mutation updateAnnotationNote($id: Int!, $note: String!) {
    updateAnnotation(id: $id, updateAnnotationInput: { note: $note }) {
      id
      note
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateAnnotationNoteGQL extends Apollo.Mutation<
  UpdateAnnotationNoteMutation,
  UpdateAnnotationNoteMutationVariables
> {
  override document = UpdateAnnotationNoteDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateAnnotationAudioDocument = gql`
  mutation updateAnnotationAudio($id: Int!, $mediaId: Int!) {
    updateAnnotation(id: $id, updateAnnotationInput: { mediaId: $mediaId }) {
      id
      media {
        id
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateAnnotationAudioGQL extends Apollo.Mutation<
  UpdateAnnotationAudioMutation,
  UpdateAnnotationAudioMutationVariables
> {
  override document = UpdateAnnotationAudioDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RemoveAnnotationAudioDocument = gql`
  mutation removeAnnotationAudio($id: Int!) {
    removeAnnotationMedia(id: $id) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RemoveAnnotationAudioGQL extends Apollo.Mutation<
  RemoveAnnotationAudioMutation,
  RemoveAnnotationAudioMutationVariables
> {
  override document = RemoveAnnotationAudioDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const CreateAnnotationCommentDocument = gql`
  mutation createAnnotationComment($annotationId: Int!, $commentText: String!) {
    createComment(createCommentInput: { annotationId: $annotationId, text: $commentText }) {
      id
      text
      owner {
        id
        role
        createdAt
        updatedAt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class CreateAnnotationCommentGQL extends Apollo.Mutation<
  CreateAnnotationCommentMutation,
  CreateAnnotationCommentMutationVariables
> {
  override document = CreateAnnotationCommentDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const UpdateAnnotationCommentDocument = gql`
  mutation updateAnnotationComment($commentId: Int!, $commentText: String!) {
    updateComment(id: $commentId, updateCommentInput: { text: $commentText }) {
      id
      text
      owner {
        id
        role
        createdAt
        updatedAt
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateAnnotationCommentGQL extends Apollo.Mutation<
  UpdateAnnotationCommentMutation,
  UpdateAnnotationCommentMutationVariables
> {
  override document = UpdateAnnotationCommentDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const RemoveAnnotationCommentDocument = gql`
  mutation removeAnnotationComment($commentId: Int!) {
    removeComment(id: $commentId) {
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class RemoveAnnotationCommentGQL extends Apollo.Mutation<
  RemoveAnnotationCommentMutation,
  RemoveAnnotationCommentMutationVariables
> {
  override document = RemoveAnnotationCommentDocument;

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
      lockAnnotationDelete
      playMode
      playPosition
      liveSessionStart
      liveSessionEnd
      currentSessionServerTime
      isSessionOwner
      isAudioSession
      code
      userSessions {
        id
        owner {
          id
          email
          displayName
          role
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
        role
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
      lockAnnotationDelete
      playMode
      playPosition
      liveSessionStart
      liveSessionEnd
      currentSessionServerTime
      isSessionOwner
      isAudioSession
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
          role
        }
        annotations {
          id
          comments {
            id
            text
            createdAt
            owner {
              id
              role
              createdAt
              updatedAt
            }
          }
          media {
            id
          }
          end
          start
          value
          marker {
            id
            name
            type
            color
            contentColor
          }
        }
      }
      owner {
        id
        role
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
      contentColor
      icon
      createdAt
      updatedAt
      type
      valueRangeFrom
      valueRangeTo
      owner {
        id
        role
        createdAt
        updatedAt
      }
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
      role
      createdAt
      updatedAt
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
export const SessionExportDocument = gql`
  query sessionExport($sessionId: Int!) {
    session(id: $sessionId) {
      id
      start
      end
      name
      description
      status
      isAudioSession
      userSessions {
        id
        status
        note
        annotations {
          id
          start
          end
          value
          comments {
            id
            text
            createdAt
            owner {
              id
              role
              createdAt
              updatedAt
            }
          }
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

@Injectable({
  providedIn: 'root',
})
export class SessionExportGQL extends Apollo.Query<SessionExportQuery, SessionExportQueryVariables> {
  override document = SessionExportDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
export const SessionCsvExportDocument = gql`
  query sessionCSVExport($sessionId: Int!) {
    session(id: $sessionId) {
      id
      start
      end
      name
      description
      status
      isAudioSession
      owner {
        id
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
        status
        note
        owner {
          id
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

@Injectable({
  providedIn: 'root',
})
export class SessionCsvExportGQL extends Apollo.Query<SessionCsvExportQuery, SessionCsvExportQueryVariables> {
  override document = SessionCsvExportDocument;

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
