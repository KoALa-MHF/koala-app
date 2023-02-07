import { ObjectType, Field, Int, registerEnumType, ID } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Media } from '../../media/entities/media.entity';
import { customAlphabet } from 'nanoid';
import { nolookalikes } from 'nanoid-dictionary';
import { Marker } from '../../markers/entities/marker.entity';
import { Toolbar } from '../../toolbars/entities/toolbar.entity';

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

  @Column({ nullable: true, default: '' })
  @Field({ nullable: true, description: 'Description', defaultValue: '' })
  @IsOptional()
  description?: string;

  @Column({
    type: 'simple-enum',
    enum: SessionStatus,
    default: SessionStatus.OPEN,
    nullable: true,
  })
  @Field(() => SessionStatus, {
    defaultValue: SessionStatus.OPEN,
    description: 'Session Status',
    nullable: true,
  })
  @IsEnum(SessionStatus)
  @IsOptional()
  status?: SessionStatus;

  @Column({
    default: false,
  })
  deleted: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true, description: 'Start of Session' })
  @IsOptional()
  start?: Date;

  @Column({ nullable: true })
  @Field({ nullable: true, description: 'End of Session' })
  @IsOptional()
  end?: Date;

  @Column({ nullable: true })
  @Field({ nullable: true, description: 'Default for Session - Editable for Participants' })
  @IsOptional()
  editable?: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true, description: 'Default for Session - Player Enabled for Participants' })
  @IsOptional()
  enablePlayer?: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true, description: 'Default for Session - Sample Solution Displayed' })
  @IsOptional()
  displaySampleSolution?: boolean;

  @Column({ nullable: true })
  @Field({ nullable: true, description: 'Default for Session - Annotations are Directly Displayed in Analysis' })
  @IsOptional()
  enableLiveAnalysis?: boolean;

  @JoinColumn()
  @OneToOne(() => Media, { nullable: true })
  @Field((type) => Media, {
    nullable: true,
    description: 'Associated Media File',
  })
  @IsOptional()
  media?: Media;

  @Column()
  @Index({ unique: true })
  @IsNotEmpty()
  code: string;

  @JoinColumn()
  @OneToMany(() => Toolbar, (toolbar) => toolbar.session, {
    cascade: true,
  })
  @Field(
    (type) => [
      Toolbar,
    ],
    { description: 'Associated Session' }
  )
  @IsNotEmpty()
  toolbars: Toolbar[];

  @BeforeInsert()
  async generateCode() {
    this.code = await nanoid();
  }
}
