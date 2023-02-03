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
  /** Annotation Start Seconds */
  start: Scalars['Int'];
  /** Date of Last Update */
  updatedAt: Scalars['DateTime'];
  /** Associated UserSession */
  userSession: UserSession;
};

export type CreateAnnotationInput = {
  /** Annotation End Seconds */
  end?: InputMaybe<Scalars['Int']>;
  /** Associated Marker */
  markerId: Scalars['Int'];
  /** Annotation Start Seconds */
  start: Scalars['Int'];
  /** Associated User Session */
  userSessionId: Scalars['Int'];
};

export type CreateMarkerInput = {
  /** Marker Name Abbreviation (e.g. for small screen sizes */
  abbreviation: Scalars['String'];
  /** Marker Color */
  color?: Scalars['String'];
  /** Marker Descritpion */
  description?: Scalars['String'];
  /** Marker Name */
  name: Scalars['String'];
  /** Marker Type */
  type: MarkerType;
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

export type CreateUserSessionInput = {
  /** User Session Note */
  note?: Scalars['String'];
  /** Associated Session */
  sessionId: Scalars['Int'];
};

export type Marker = {
  __typename?: 'Marker';
  /** Marker Name Abbreviation (e.g. for small screen sizes */
  abbreviation: Scalars['String'];
  /** Marker Color */
  color: Scalars['String'];
  /** Creation Date */
  createdAt: Scalars['DateTime'];
  /** Marker Description */
  description: Scalars['String'];
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
};

export enum MarkerType {
  Event = 'EVENT',
  Range = 'RANGE',
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
  createAnnotation: Annotation;
  createMarker: Marker;
  createMedia: Media;
  createSession: Session;
  createUserSession: UserSession;
  removeAnnotation: Annotation;
  removeMarker: Marker;
  removeSession: Session;
  removeUserSession: UserSession;
  updateAnnotation: Annotation;
  updateMarker: Marker;
  updateSession: Session;
  updateToolbar: Toolbar;
  updateUserSession: UserSession;
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

export type MutationUpdateUserSessionArgs = {
  id: Scalars['Int'];
  updateUserSessionInput: UpdateUserSessionInput;
};

export type Query = {
  __typename?: 'Query';
  annotation: Annotation;
  annotations: Array<Annotation>;
  marker: Marker;
  markers: Array<Marker>;
  session: Session;
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

export type QueryUserSessionArgs = {
  id: Scalars['Int'];
};

export type Session = {
  __typename?: 'Session';
  /** Creation Date */
  createdAt: Scalars['DateTime'];
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
  /** Associated Media File */
  media?: Maybe<Media>;
  /** Session Name */
  name: Scalars['String'];
  /** Start of Session */
  start?: Maybe<Scalars['DateTime']>;
  /** Session Status */
  status?: Maybe<SessionStatus>;
  /** Associated Session */
  toolbars: Array<Toolbar>;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime'];
};

export enum SessionStatus {
  Closed = 'CLOSED',
  Open = 'OPEN',
}

export type Toolbar = {
  __typename?: 'Toolbar';
  /** Creation Date */
  createdAt: Scalars['DateTime'];
  /** ID for Media */
  id: Scalars['ID'];
  markers: Array<Scalars['String']>;
  /** Associated Session */
  session: Session;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime'];
};

export type UpdateAnnotationInput = {
  /** Annotation End Seconds */
  end?: InputMaybe<Scalars['Int']>;
  /** Associated Marker */
  markerId?: InputMaybe<Scalars['Int']>;
  /** Annotation Start Seconds */
  start?: InputMaybe<Scalars['Int']>;
};

export type UpdateMarkerInput = {
  /** Marker Name Abbreviation (e.g. for small screen sizes */
  abbreviation?: InputMaybe<Scalars['String']>;
  /** Marker Color */
  color?: InputMaybe<Scalars['String']>;
  /** Marker Descritpion */
  description?: InputMaybe<Scalars['String']>;
  /** Marker Name */
  name?: InputMaybe<Scalars['String']>;
  /** Marker Type */
  type?: InputMaybe<MarkerType>;
};

export type UpdateSessionInput = {
  description?: InputMaybe<Scalars['String']>;
  displaySampleSolution?: InputMaybe<Scalars['Boolean']>;
  editable?: InputMaybe<Scalars['Boolean']>;
  enableLiveAnalysis?: InputMaybe<Scalars['Boolean']>;
  enablePlayer?: InputMaybe<Scalars['Boolean']>;
  end?: InputMaybe<Scalars['DateTime']>;
  /** Assigned Media */
  mediaId?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  start?: InputMaybe<Scalars['DateTime']>;
  status?: InputMaybe<SessionStatus>;
};

export type UpdateToolbarInput = {
  markers?: Array<Scalars['String']>;
};

export type UpdateUserSessionInput = {
  /** User Session Note */
  note?: InputMaybe<Scalars['String']>;
};

export type UserSession = {
  __typename?: 'UserSession';
  /** Creation Date */
  createdAt: Scalars['DateTime'];
  /** ID for User Session */
  id: Scalars['Int'];
  /** User Session Note */
  note?: Maybe<Scalars['String']>;
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
    createdAt: any;
    updatedAt: any;
    media?: { __typename?: 'Media'; id: string; name: string; mimeType: string; createdAt: any; updatedAt: any } | null;
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
    createdAt: any;
    updatedAt: any;
    media?: { __typename?: 'Media'; id: string; name: string; mimeType: string; createdAt: any; updatedAt: any } | null;
  };
};

export type DeleteSessionMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type DeleteSessionMutation = { __typename?: 'Mutation'; removeSession: { __typename?: 'Session'; id: string } };

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
  updateToolbar: { __typename?: 'Toolbar'; id: string; markers: Array<string> };
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
    createdAt: any;
    updatedAt: any;
    media?: { __typename?: 'Media'; id: string; name: string; mimeType: string; createdAt: any; updatedAt: any } | null;
    toolbars: Array<{ __typename?: 'Toolbar'; id: string; markers: Array<string>; createdAt: any; updatedAt: any }>;
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
    createdAt: any;
    updatedAt: any;
    media?: { __typename?: 'Media'; id: string; name: string; mimeType: string; createdAt: any; updatedAt: any } | null;
    toolbars: Array<{ __typename?: 'Toolbar'; id: string; markers: Array<string>; createdAt: any; updatedAt: any }>;
  };
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
    abbreviation: string;
    description: string;
    color: string;
    icon?: string | null;
    createdAt: any;
    updatedAt: any;
    type: MarkerType;
  }>;
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
      markers
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
      media {
        id
        name
        mimeType
        createdAt
        updatedAt
      }
      toolbars {
        id
        markers
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
      media {
        id
        name
        mimeType
        createdAt
        updatedAt
      }
      toolbars {
        id
        markers
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
