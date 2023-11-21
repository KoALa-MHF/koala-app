import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { MaxLength } from 'class-validator';

export const COMMENT_NOTE_MAX_LENGTH = 1024;

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'ID for Comment' })
  id: number;

  @Column({ length: COMMENT_NOTE_MAX_LENGTH, default: '' })
  @Field({ description: 'Comment Note', defaultValue: '' })
  @MaxLength(COMMENT_NOTE_MAX_LENGTH)
  note: string;
}
