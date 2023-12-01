import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export const COMMENT_TEXT_MAX_LENGTH = 1024;

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'ID for Comment' })
  id: number;

  @Column({ length: COMMENT_TEXT_MAX_LENGTH, default: '' })
  @Field({ description: 'Comment Text', defaultValue: '' })
  @MaxLength(COMMENT_TEXT_MAX_LENGTH)
  text: string;

  @ManyToOne(() => User)
  @Field((type) => User, { description: 'Associated User' })
  @IsNotEmpty()
  owner: User;

  @Column()
  ownerId: number;
}
