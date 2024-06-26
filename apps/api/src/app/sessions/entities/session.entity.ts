import { ObjectType, Field, registerEnumType, ID } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { AfterLoad, BeforeInsert, Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Media } from '../../media/entities/media.entity';
import { customAlphabet } from 'nanoid';
import { nolookalikes } from 'nanoid-dictionary';
import { Toolbar } from '../../toolbars/entities/toolbar.entity';
import { Toolbar as ToolbarType } from '../../toolbars/dto/toolbar';
import { UserSession } from '../../user-sessions/entities/user-session.entity';
import { User } from '../../users/entities/user.entity';

const nanoid = customAlphabet(nolookalikes, 7);

export enum SessionStatus {
  IN_PREPARATION = 'preparation',
  OPEN = 'open',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export enum PlayMode {
  RUNNING = 'running',
  PAUSED = 'paused',
}

registerEnumType(SessionStatus, {
  name: 'SessionStatus',
});

registerEnumType(PlayMode, {
  name: 'PlayMode',
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
    default: SessionStatus.IN_PREPARATION,
    nullable: true,
  })
  @Field(() => SessionStatus, {
    defaultValue: SessionStatus.IN_PREPARATION,
    description: 'Session Status',
    nullable: true,
  })
  @IsEnum(SessionStatus)
  @IsOptional()
  status?: SessionStatus;

  @AfterLoad()
  updateStatus() {
    if (this.start && this.end) {
      const now = Date.now();
      const start = this.start.valueOf();
      const end = this.end.valueOf();

      if (this.status === SessionStatus.IN_PREPARATION) {
        if (start <= now && end >= now) {
          this.status = SessionStatus.OPEN;
        } else if (end < now) {
          this.status = SessionStatus.CLOSED;
        }
      } else if (this.status === SessionStatus.OPEN) {
        if (end < now) {
          this.status = SessionStatus.CLOSED;
        }
      }
    }
  }

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

  @Column({ nullable: true })
  @Field({
    nullable: true,
    description: 'Default for Session - Are Participants Allowed to Delete Their Own Annotations',
  })
  @IsOptional()
  lockAnnotationDelete?: boolean;

  @ManyToOne(() => Media, { nullable: true })
  @Field((type) => Media, {
    nullable: true,
    description: 'Associated Media File',
  })
  @IsOptional()
  media?: Media;

  @Column({ nullable: true })
  mediaId?: number;

  @Column()
  @Field() //TODO: make it only visible for session owner
  @Index({ unique: true })
  @IsNotEmpty()
  code: string;

  @ManyToOne(() => User, {
    cascade: [
      'insert',
    ],
  })
  @Field((type) => User, { description: 'Associated User' })
  @IsNotEmpty()
  owner: User;

  @Column()
  ownerId: number;

  @OneToMany(() => Toolbar, (toolbar) => toolbar.session, {
    cascade: true,
  })
  @Field(
    (type) => [
      ToolbarType,
    ],
    { description: 'Associated Toolbars' }
  )
  toolbars: Toolbar[];

  @OneToMany(() => UserSession, (userSession) => userSession.session, {
    cascade: [
      'insert',
    ],
  })
  @Field(
    (type) => [
      UserSession,
    ],
    { description: 'Associated User Sessions' }
  )
  userSessions: UserSession[];

  @Field(() => PlayMode, { defaultValue: PlayMode.PAUSED, description: 'Play Mode', nullable: true })
  @Column({ type: 'simple-enum', enum: PlayMode, default: PlayMode.PAUSED, nullable: true })
  playMode: PlayMode;

  @Field({ nullable: true })
  @Column({ nullable: true })
  playPosition: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  liveSessionStart: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  liveSessionEnd: number;

  @Field({ nullable: false })
  currentSessionServerTime: number;

  @Field({ nullable: false })
  isAudioSession: boolean;

  @Field({ nullable: false })
  isSessionOwner: boolean;

  @BeforeInsert()
  async generateCode() {
    this.code = await nanoid();
  }

  @AfterLoad()
  fillCurrentSessionServerTime() {
    this.currentSessionServerTime = Date.now();
  }

  @AfterLoad()
  fillIsAudioSession() {
    if (this.mediaId) {
      this.isAudioSession = true;
    } else {
      this.isAudioSession = false;
    }
  }
}
