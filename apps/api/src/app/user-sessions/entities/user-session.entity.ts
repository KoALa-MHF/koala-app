import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, MaxLength, maxLength } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, MaxKey, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Session } from '../../sessions/entities/session.entity';

export enum UserSessionStatus {
  INITIAL = 'initial',
  STARTED = 'started',
  SUBMITTED = 'submitted',
}

export const USER_SESSION_STATUS_DEFAULT = UserSessionStatus.INITIAL;

export const USER_SESSION_NOTE_MAX_LENGTH = 1024;

registerEnumType(UserSessionStatus, {
  name: 'UserSessionStatus',
});

@ObjectType()
@Entity()
export class UserSession extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'ID for User Session' })
  id: number;

  @Column({
    type: 'simple-enum',
    enum: UserSessionStatus,
    default: USER_SESSION_STATUS_DEFAULT,
  })
  @Field(() => UserSessionStatus, { defaultValue: USER_SESSION_STATUS_DEFAULT, description: 'User Session Status' })
  @IsEnum(UserSessionStatus)
  @IsNotEmpty()
  status: UserSessionStatus;

  @Column({ nullable: true })
  @Field({ nullable: true, description: 'User Session Note' })
  @MaxLength(USER_SESSION_NOTE_MAX_LENGTH)
  note: string;

  @JoinColumn({ name: 'sessionId' })
  @ManyToOne(() => Session)
  @Field((type) => Session, { description: 'Associated Session' })
  @IsNotEmpty()
  session: Session;

  @Column({ nullable: false })
  sessionId: number;
}
