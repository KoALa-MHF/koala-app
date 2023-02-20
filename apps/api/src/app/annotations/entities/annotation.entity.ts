import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Marker } from '../../markers/entities/marker.entity';
import { UserSession } from '../../user-sessions/entities/user-session.entity';

@ObjectType()
@Entity()
export class Annotation extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'ID for Annotation' })
  id: number;

  @Column()
  @Field(() => Int, { description: 'Annotation Start Seconds' })
  @IsNotEmpty()
  start: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true, description: 'Annotation End Seconds' })
  end?: number;

  @JoinColumn({ name: 'markerId' })
  @ManyToOne(() => Marker)
  @Field((type) => Marker, { description: 'Associated Marker' })
  @IsNotEmpty()
  marker: Marker;

  @Column({ nullable: false })
  markerId: number;

  @JoinColumn({ name: 'userSessionId' })
  @ManyToOne(() => UserSession)
  @Field((type) => UserSession, { description: 'Associated UserSession' })
  @IsNotEmpty()
  userSession: UserSession;

  @Column({ nullable: false })
  userSessionId: number;
}
