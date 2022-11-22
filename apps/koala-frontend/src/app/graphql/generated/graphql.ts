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
};

export type CreateAnnotationInput = {
  /** Annotation End Seconds */
  end?: InputMaybe<Scalars['Int']>;
  /** Associated Marker */
  markerId: Scalars['Int'];
  /** Annotation Start Seconds */
  start: Scalars['Int'];
};

export type CreateMarkerInput = {
  /** Marker Color */
  color?: InputMaybe<Scalars['String']>;
  /** Marker Name */
  name: Scalars['String'];
  /** Marker Type */
  type: MarkerType;
};

export type CreateMediaInput = {
  /** Media Composer */
  composer: Scalars['String'];
  /** Media Title */
  title: Scalars['String'];
  /** Media Type */
  type: MediaType;
};

export type CreateSessionInput = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  status?: InputMaybe<SessionStatus>;
};

export type CreateUserSessionInput = {
  /** Associated Session */
  sessionId: Scalars['Int'];
};

export type Marker = {
  __typename?: 'Marker';
  /** Marker Color */
  color: Scalars['String'];
  /** Creation Date */
  createdAt: Scalars['DateTime'];
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
  Range = 'RANGE'
}

export type Media = {
  __typename?: 'Media';
  /** Media Composer */
  composer: Scalars['String'];
  /** Creation Date */
  createdAt: Scalars['DateTime'];
  /** ID for Media */
  id: Scalars['Int'];
  /** Media Title */
  title: Scalars['String'];
  /** Media Type */
  type: MediaType;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime'];
};

export enum MediaType {
  Audio = 'AUDIO'
}

export type Mutation = {
  __typename?: 'Mutation';
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
  setMedia: Session;
  updateAnnotation: Annotation;
  updateMarker: Marker;
  updateMedia: Media;
  updateSession: Session;
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


export type MutationRemoveMediaArgs = {
  id: Scalars['Int'];
};


export type MutationRemoveSessionArgs = {
  id: Scalars['Int'];
};


export type MutationRemoveUserSessionArgs = {
  id: Scalars['Int'];
};


export type MutationSetMediaArgs = {
  id: Scalars['Int'];
  mediaId: Scalars['Int'];
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
  description: Scalars['String'];
  /** ID for Session */
  id: Scalars['Int'];
  /** Associated Media File */
  media?: Maybe<Media>;
  /** Session Name */
  name: Scalars['String'];
  /** Session Status */
  status: SessionStatus;
  /** Date of Last Update */
  updatedAt: Scalars['DateTime'];
};

export enum SessionStatus {
  Closed = 'CLOSED',
  Open = 'OPEN'
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
  /** Marker Color */
  color?: InputMaybe<Scalars['String']>;
  /** Marker Name */
  name?: InputMaybe<Scalars['String']>;
  /** Marker Type */
  type?: InputMaybe<MarkerType>;
};

export type UpdateMediaInput = {
  /** Media Composer */
  composer?: InputMaybe<Scalars['String']>;
  /** Media Title */
  title?: InputMaybe<Scalars['String']>;
};

export type UpdateSessionInput = {
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<SessionStatus>;
};

export type UpdateUserSessionInput = {
  /** User Session Note */
  note: Scalars['String'];
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
  Submitted = 'SUBMITTED'
}

export type CreateNewSessionMutationVariables = Exact<{
  session: CreateSessionInput;
}>;


export type CreateNewSessionMutation = { __typename?: 'Mutation', createSession: { __typename?: 'Session', id: number, name: string, description: string } };

export type UpdateSessionMutationVariables = Exact<{
  id: Scalars['Int'];
  session: UpdateSessionInput;
}>;


export type UpdateSessionMutation = { __typename?: 'Mutation', updateSession: { __typename?: 'Session', id: number, name: string, description: string, status: SessionStatus } };

export type DeleteSessionMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteSessionMutation = { __typename?: 'Mutation', removeSession: { __typename?: 'Session', id: number } };

export type GetSessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSessionsQuery = { __typename?: 'Query', sessions: Array<{ __typename?: 'Session', id: number, name: string, description: string, status: SessionStatus, createdAt: any, updatedAt: any }> };

export type GetOneSessionQueryVariables = Exact<{
  sessionId: Scalars['Int'];
}>;


export type GetOneSessionQuery = { __typename?: 'Query', session: { __typename?: 'Session', id: number, name: string, description: string, status: SessionStatus, createdAt: any, updatedAt: any } };

export const CreateNewSessionDocument = gql`
    mutation createNewSession($session: CreateSessionInput!) {
  createSession(createSessionInput: $session) {
    id
    name
    description
  }
}
    `;

  @Injectable({
    providedIn: 'root'
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
    id
    name
    description
    status
  }
}
    `;

  @Injectable({
    providedIn: 'root'
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
    providedIn: 'root'
  })
  export class DeleteSessionGQL extends Apollo.Mutation<DeleteSessionMutation, DeleteSessionMutationVariables> {
    override document = DeleteSessionDocument;
    
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
    createdAt
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
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
    createdAt
    updatedAt
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetOneSessionGQL extends Apollo.Query<GetOneSessionQuery, GetOneSessionQueryVariables> {
    override document = GetOneSessionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }