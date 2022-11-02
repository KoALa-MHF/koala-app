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

export type CreateSessionInput = {
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createSession: Session;
  removeSession: Session;
  updateSession: Session;
};


export type MutationCreateSessionArgs = {
  createSessionInput: CreateSessionInput;
};


export type MutationRemoveSessionArgs = {
  id: Scalars['Int'];
};


export type MutationUpdateSessionArgs = {
  updateSessionInput: UpdateSessionInput;
};

export type Query = {
  __typename?: 'Query';
  session: Session;
  sessions: Array<Session>;
};


export type QuerySessionArgs = {
  id: Scalars['Int'];
};

export type Session = {
  __typename?: 'Session';
  /** Creation Date */
  createdDate: Scalars['DateTime'];
  /** ID for Session */
  id: Scalars['Int'];
  /** Unique Session Name */
  name: Scalars['String'];
  /** Date of Last Update */
  updatedDate: Scalars['DateTime'];
};

export type UpdateSessionInput = {
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type GetSessionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSessionsQuery = { __typename?: 'Query', sessions: Array<{ __typename?: 'Session', id: number, name: string, createdDate: any, updatedDate: any }> };

export type CreateNewSessionMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateNewSessionMutation = { __typename?: 'Mutation', createSession: { __typename?: 'Session', id: number, name: string } };

export type DeleteSessionMutationVariables = Exact<{
  id: Scalars['Int'];
}>;


export type DeleteSessionMutation = { __typename?: 'Mutation', removeSession: { __typename?: 'Session', id: number } };

export const GetSessionsDocument = gql`
    query GetSessions {
  sessions {
    id
    name
    createdDate
    updatedDate
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetSessionsGQL extends Apollo.Query<GetSessionsQuery, GetSessionsQueryVariables> {
    document = GetSessionsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateNewSessionDocument = gql`
    mutation createNewSession($name: String!) {
  createSession(createSessionInput: {name: $name}) {
    id
    name
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateNewSessionGQL extends Apollo.Mutation<CreateNewSessionMutation, CreateNewSessionMutationVariables> {
    document = CreateNewSessionDocument;
    
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
    document = DeleteSessionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }