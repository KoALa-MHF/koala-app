import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { SessionStatus } from '../entities/session.entity';
import { UserSessionStatus } from '../../user-sessions/entities/user-session.entity';
import { MarkerType } from '../../markers/entities/marker.entity';

@ObjectType()
export class MarkerJSON {
  @Field(() => Int, { description: 'ID for Marker' })
  id: number;

  @Field(() => MarkerType, { description: 'Marker Type' })
  @IsEnum(MarkerType)
  @IsNotEmpty()
  type: MarkerType;

  @Field({ description: 'Marker Name' })
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true, description: 'Marker Name Abbreviation (e.g. for small screen sizes' })
  abbreviation: string;

  @Field({ nullable: true, defaultValue: '', description: 'Marker Description' })
  description?: string;

  @Field({ description: 'Marker Color' })
  color: string;

  @Field({ nullable: true, description: 'Marker Icon' })
  icon?: string;

  @Field(() => Int, { nullable: true, description: 'Marker Value Range From' })
  valueRangeFrom?: number;

  @Field(() => Int, { nullable: true, description: 'Marker Value Range To' })
  valueRangeTo?: number;
}

@ObjectType()
export class AnnotationJSON {
  @Field(() => Int, { description: 'ID for Annotation' })
  id: number;

  @Field(() => Int, { description: 'Annotation Start Seconds' })
  @IsNotEmpty()
  start: number;

  @Field(() => Int, { nullable: true, description: 'Annotation End Seconds' })
  end?: number;

  @Field(() => Int, { nullable: true, description: 'Annotation Value' })
  value?: number;

  @Field((type) => MarkerJSON, { description: 'Associated Marker' })
  @IsNotEmpty()
  marker: MarkerJSON;

  @Field({ nullable: true, description: 'Annotation Note' })
  note?: string;
}

@ObjectType()
export class UserSessionJSON {
  @Field(() => Int, { description: 'ID for User Session' })
  id: number;

  @Field(() => UserSessionStatus, { description: 'User Session Status' })
  @IsEnum(UserSessionStatus)
  @IsNotEmpty()
  status: UserSessionStatus;

  @IsNotEmpty()
  code: string;

  @Field({ nullable: true, description: 'User Session Note', defaultValue: '' })
  note?: string;

  @Field(
    () => [
      AnnotationJSON,
    ],
    { description: 'Associated Annotations' }
  )
  annotations: AnnotationJSON[];
}

@ObjectType()
export class SessionJSON {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => SessionStatus, { defaultValue: SessionStatus.IN_PREPARATION })
  @IsEnum(SessionStatus)
  @IsOptional()
  status?: SessionStatus;

  @Field({ nullable: true })
  @IsOptional()
  start?: Date;

  @Field({ nullable: true })
  @IsOptional()
  end?: Date;

  @Field()
  isAudioSession: boolean;

  @Field(() => [
    UserSessionJSON,
  ])
  userSessions: UserSessionJSON[];
}
