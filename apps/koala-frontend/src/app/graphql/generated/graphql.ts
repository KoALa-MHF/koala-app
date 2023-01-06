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

export type AddMarkerToSessionInput = {
  /** Associated Marker */
  markerId: Scalars['Int'];
  /** Session ID */
  sessionId: Scalars['Int'];
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
  color?: InputMaybe<Scalars['String']>;
  /** Marker Descritpion */
  description?: InputMaybe<Scalars['String']>;
  /** Marker Name */
  name: Scalars['String'];
  /** Marker Type */
  type: MarkerType;
};

export type CreateMediaInput = {
  file: Scalars['Upload'];
  /** Media Type */
  type: MediaType;
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
  status?: InputMaybe<SessionStatus>;
};

export type CreateUserSessionInput = {
  /** User Session Note */
  note?: InputMaybe<Scalars['String']>;
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
  /** Media Composer */
  composer?: Maybe<Scalars['String']>;
  /** Creation Date */
  createdAt: Scalars['DateTime'];
  /** ID for Media */
  id: Scalars['ID'];
  /** Media Title */
  title?: Maybe<Scalars['String']>;
  /** Media Type */
  type: MediaType;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime'];
};

export enum MediaType {
  Audio = 'AUDIO',
}

export type Mutation = {
  __typename?: 'Mutation';
  addMarkerToSession: Session;
  createAnnotation: Annotation;
  createMarker: Marker;
  createMedia: Media;
  createSession: Session;
  createUserSession: UserSession;
  removeAnnotation: Annotation;
  removeMarker: Marker;
  removeMedia: Media;
  removeSession: Session;
  removeUserSession: UserSession;
  updateAnnotation: Annotation;
  updateMarker: Marker;
  updateMedia: Media;
  updateSession: Session;
  updateUserSession: UserSession;
};

export type MutationAddMarkerToSessionArgs = {
  addMarkerToSessionInput: AddMarkerToSessionInput;
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

export type MutationRemoveMediaArgs = {
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

export type MutationUpdateMediaArgs = {
  id: Scalars['Int'];
  updateMediaInput: UpdateMediaInput;
};

export type MutationUpdateSessionArgs = {
  id: Scalars['Int'];
  updateSessionInput: UpdateSessionInput;
};

export type MutationUpdateUserSessionArgs = {
  id: Scalars['Int'];
  updateUserSessionInput: UpdateUserSessionInput;
};

export type Query = {
  __typename?: 'Query';
  allMedia: Array<Media>;
  annotation: Annotation;
  annotations: Array<Annotation>;
  marker: Marker;
  markers: Array<Marker>;
  media: Media;
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

export type QueryMediaArgs = {
  id: Scalars['Int'];
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
  /** Associated Markers */
  markers?: Maybe<Array<Marker>>;
  /** Associated Media File */
  media?: Maybe<Media>;
  /** Session Name */
  name: Scalars['String'];
  /** Start of Session */
  start?: Maybe<Scalars['DateTime']>;
  /** Session Status */
  status?: Maybe<SessionStatus>;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime'];
};

export enum SessionStatus {
  Closed = 'CLOSED',
  Open = 'OPEN',
}

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

export type UpdateMediaInput = {
  file?: InputMaybe<Scalars['Upload']>;
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
    media?: {
      __typename?: 'Media';
      id: string;
      type: MediaType;
      title?: string | null;
      composer?: string | null;
      createdAt: any;
      updatedAt: any;
    } | null;
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
    media?: {
      __typename?: 'Media';
      id: string;
      type: MediaType;
      title?: string | null;
      composer?: string | null;
      createdAt: any;
      updatedAt: any;
    } | null;
  };
};

export type DeleteSessionMutationVariables = Exact<{
  id: Scalars['Int'];
}>;

export type DeleteSessionMutation = { __typename?: 'Mutation'; removeSession: { __typename?: 'Session'; id: string } };

export type CreateMediaMutationVariables = Exact<{
  media: CreateMediaInput;
}>;

export type CreateMediaMutation = {
  __typename?: 'Mutation';
  createMedia: { __typename?: 'Media'; title?: string | null; composer?: string | null; type: MediaType; id: string };
};

export type UpdateMediaMutationVariables = Exact<{
  id: Scalars['Int'];
  updateMedia: UpdateMediaInput;
}>;

export type UpdateMediaMutation = {
  __typename?: 'Mutation';
  updateMedia: { __typename?: 'Media'; title?: string | null; composer?: string | null; type: MediaType; id: string };
};

export type CreateMarkerMutationVariables = Exact<{
  createMarker: CreateMarkerInput;
}>;

export type CreateMarkerMutation = {
  __typename?: 'Mutation';
  createMarker: { __typename?: 'Marker'; id: number; type: MarkerType; name: string; color: string };
};

export type AddMarkerMutationVariables = Exact<{
  addMarkerToSession: AddMarkerToSessionInput;
}>;

export type AddMarkerMutation = {
  __typename?: 'Mutation';
  addMarkerToSession: {
    __typename?: 'Session';
    id: string;
    markers?: Array<{ __typename?: 'Marker'; id: number; name: string; type: MarkerType }> | null;
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
    createdAt: any;
    updatedAt: any;
    media?: { __typename?: 'Media'; id: string; type: MediaType; createdAt: any; updatedAt: any } | null;
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
    media?: { __typename?: 'Media'; id: string; type: MediaType; createdAt: any; updatedAt: any } | null;
    markers?: Array<{
      __typename?: 'Marker';
      id: number;
      name: string;
      type: MarkerType;
      abbreviation: string;
      description: string;
      color: string;
      createdAt: any;
      updatedAt: any;
    }> | null;
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
      media {
        id
        type
        title
        composer
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
        type
        title
        composer
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
      title
      composer
      type
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
export const UpdateMediaDocument = gql`
  mutation updateMedia($id: Int!, $updateMedia: UpdateMediaInput!) {
    updateMedia(id: $id, updateMediaInput: $updateMedia) {
      title
      composer
      type
      id
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class UpdateMediaGQL extends Apollo.Mutation<UpdateMediaMutation, UpdateMediaMutationVariables> {
  override document = UpdateMediaDocument;

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
export const AddMarkerDocument = gql`
  mutation addMarker($addMarkerToSession: AddMarkerToSessionInput!) {
    addMarkerToSession(addMarkerToSessionInput: $addMarkerToSession) {
      id
      markers {
        id
        name
        type
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AddMarkerGQL extends Apollo.Mutation<AddMarkerMutation, AddMarkerMutationVariables> {
  override document = AddMarkerDocument;

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
        type
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
        type
        createdAt
        updatedAt
      }
      markers {
        id
        name
        type
        abbreviation
        description
        color
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
