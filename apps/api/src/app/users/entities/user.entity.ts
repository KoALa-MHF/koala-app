import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { AfterLoad, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';

export enum Role {
  USER = 'user',
  GUEST = 'guest',
}

registerEnumType(Role, {
  name: 'Role',
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'ID for User' })
  id: number;

  @Field(() => Role, { defaultValue: Role.GUEST, description: 'User Role', nullable: false })
  role: Role;

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
    unique: true,
  })
  samlId?: string;

  @AfterLoad()
  async updateDefaultValues() {
    this.displayName = this.displayName || '';
    this.role = this.samlId ? Role.USER : Role.GUEST;
  }

  isRegistered() {
    return this.samlId != null;
  }
}
