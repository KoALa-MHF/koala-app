import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Marker } from '../../markers/entities/marker.entity';
import { UserSession } from '../../user-sessions/entities/user-session.entity';

export const ANNOTATION_NOTE_MAX_LENGTH = 1024;

@ObjectType()
@Entity()
export class Annotation extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'ID for Annotation' })
  id: number;

  @Column()
  @Field(() => Int, { description: 'Annotation Start Seconds' })
  @IsNotEmpty()
  start: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true, description: 'Annotation End Seconds' })
  end?: number;

  @ManyToOne(() => Marker)
  @Field((type) => Marker, { description: 'Associated Marker' })
  @IsNotEmpty()
  marker: Marker;

  @Column()
  markerId: number;

  @ManyToOne(() => UserSession)
  @Field((type) => UserSession, { description: 'Associated UserSession' })
  @IsNotEmpty()
  userSession: UserSession;

  @Column({ nullable: true, length: ANNOTATION_NOTE_MAX_LENGTH, default: '' })
  @Field({ nullable: true, description: 'Annotation Note', defaultValue: '' })
  @MaxLength(ANNOTATION_NOTE_MAX_LENGTH)
  note?: string;

  @Column()
  userSessionId: number;
}
