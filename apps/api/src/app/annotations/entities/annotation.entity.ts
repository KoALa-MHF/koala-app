import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Marker } from '../../markers/entities/marker.entity';
import { UserSession } from '../../user-sessions/entities/user-session.entity';
import { Media } from '../../media/entities/media.entity';
import { Comment } from '../../comments/entities/comment.entity';

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

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true, description: 'Annotation Value' })
  value?: number;

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

  @Column()
  userSessionId: number;

  @Column({ nullable: true, length: ANNOTATION_NOTE_MAX_LENGTH, default: '' })
  @Field({ nullable: true, description: 'Annotation Note', defaultValue: '' })
  @MaxLength(ANNOTATION_NOTE_MAX_LENGTH)
  note?: string;

  @ManyToOne(() => Media, { nullable: true })
  @Field((type) => Media, {
    nullable: true,
    description: 'Associated Media File',
  })
  @IsOptional()
  media?: Media;

  @Column({ nullable: true })
  mediaId?: number;

  @OneToMany(() => Comment, (comment) => comment.annotation, { cascade: true })
  @Field(
    (type) => [
      Comment,
    ],
    { description: 'Associated Comments' }
  )
  comments: Comment[];
}
