import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'ID for User' })
  id: number;

  @Column({
    nullable: true,
    default: '',
  })
  @Field({ description: 'User Display Name', defaultValue: '' })
  displayName?: string;

  @Column()
  @Field({ description: 'User Email' })
  @Index()
  email: string;

  @Column({
    nullable: true,
  })
  samlId?: string;

  isRegistered() {
    return this.samlId != null;
  }
}
