import { ObjectType, Field } from '@nestjs/graphql';
import {
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class BaseEntity {
  @CreateDateColumn()
  @Field({ description: 'Creation Date' })
  createdDate: Date;

  @UpdateDateColumn()
  @Field({ description: 'Date of Last Update' })
  updatedDate: Date;
}
