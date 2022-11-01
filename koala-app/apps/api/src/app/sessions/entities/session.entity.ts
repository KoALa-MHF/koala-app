import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'ID for Session' })
  id: number;

  @Column()
  @Field({ description: 'Unique Session Name' })
  @IsNotEmpty()
  name: string;

  @CreateDateColumn()
  @Field({ description: 'Creation Date' })
  createdDate: Date;

  @UpdateDateColumn()
  @Field({ description: 'Date of Last Update' })
  updatedDate: Date;
}
