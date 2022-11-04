import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BaseEntity } from '../../core/base.entity';

@ObjectType()
@Entity()
export class Session extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'ID for Session' })
  id: number;

  @Column()
  @Field({ description: 'Unique Session Name' })
  @IsNotEmpty()
  name: string;
}
