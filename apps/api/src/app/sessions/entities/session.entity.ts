import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Media } from '../../media/entities/media.entity';
import { customAlphabet } from 'nanoid';
import { nolookalikes } from 'nanoid-dictionary';

const nanoid = customAlphabet(nolookalikes, 7);

export enum SessionStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

registerEnumType(SessionStatus, {
  name: 'SessionStatus',
});

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

  @Column({
    type: 'simple-enum',
    enum: SessionStatus,
    default: SessionStatus.OPEN,
  })
  @Field(() => SessionStatus, {
    defaultValue: SessionStatus.OPEN,
    description: 'Session Status',
  })
  @IsEnum(SessionStatus)
  @IsNotEmpty()
  status: SessionStatus;

  @Column({
    default: false,
  })
  deleted: boolean;

  @Column()
  @Field({ description: 'Start of Session' })
  start: Date;

  @Column()
  @Field({ description: 'End of Session' })
  end: Date;

  @Column()
  @Field({ description: 'Default for Session - Editable for Participants' })
  isEditable: boolean;

  @Column()
  @Field({ description: 'Default for Session - Player Enabled for Participants' })
  isPlayerEnabled: boolean;

  @Column()
  @Field({ description: 'Default for Session - Sample Solution Displayed' })
  isSampleSolutionDisplayed: boolean;

  @Column()
  @Field({ description: 'Default for Session - Annotations are Directly Displayed in Analysis' })
  isLiveAnalysisDisplayed: boolean;

  @JoinColumn()
  @OneToOne(() => Media, { nullable: true })
  @Field((type) => Media, {
    nullable: true,
    description: 'Associated Media File',
  })
  media?: Media;

  @Column()
  @Index({ unique: true })
  @IsNotEmpty()
  code: string;

  @BeforeInsert()
  async generateCode() {
    this.code = await nanoid();
  }
}
