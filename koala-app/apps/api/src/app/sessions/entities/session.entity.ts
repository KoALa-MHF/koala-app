import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Media } from '../../media/entities/media.entity';

@ObjectType()
@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'ID for Session' })
  id: number;

  @Column()
  @Field({ description: 'Session Name' })
  @IsNotEmpty()
  name: string;

  @Column()
  @Field({ description: 'Description' })
  description: string;

  @JoinColumn()
  @OneToOne(() => Media, { nullable: true })
  @Field(type => Media, { nullable: true, description: 'Associated Media File' })
  media?: Media;
}
