import { ObjectType, Field, ID } from '@nestjs/graphql';
import { AfterLoad, AfterUpdate, BeforeUpdate, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
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
  @Field({ description: 'User Display Name', nullable: true, defaultValue: '' })
  displayName?: string;

  @Column({
    nullable: true,
    unique: true,
  })
  @Field({ description: 'User Email', nullable: true })
  email?: string;

  @Column({
    nullable: true,
  })
  samlId?: string;

  @AfterLoad()
  async updateDefaultValues() {
    this.displayName = this.displayName || '';
  }

  isRegistered() {
    return this.samlId != null;
  }
}
