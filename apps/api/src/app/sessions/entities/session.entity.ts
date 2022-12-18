import { ObjectType, Field, Int, registerEnumType, ID } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Media } from '../../media/entities/media.entity';
import { customAlphabet } from 'nanoid';
import { nolookalikes } from 'nanoid-dictionary';
import { Marker } from '../../markers/entities/marker.entity';

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
  @Field((type) => ID, { description: 'ID for Session' })
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
  editable: boolean;

  @Column()
  @Field({ description: 'Default for Session - Player Enabled for Participants' })
  enablePlayer: boolean;

  @Column()
  @Field({ description: 'Default for Session - Sample Solution Displayed' })
  displaySampleSolution: boolean;

  @Column()
  @Field({ description: 'Default for Session - Annotations are Directly Displayed in Analysis' })
  enableLiveAnalysis: boolean;

  @JoinColumn()
  @OneToOne(() => Media, { nullable: true })
  @Field((type) => Media, {
    nullable: true,
    description: 'Associated Media File',
  })
  media?: Media;

  @JoinTable()
  @ManyToMany(() => Marker, { nullable: true })
  @Field(
    (type) => [
      Marker,
    ],
    {
      nullable: true,
      description: 'Associated Markers',
    }
  )
  markers?: Marker[];

  @Column()
  @Index({ unique: true })
  @IsNotEmpty()
  code: string;

  @BeforeInsert()
  async generateCode() {
    this.code = await nanoid();
  }
}
