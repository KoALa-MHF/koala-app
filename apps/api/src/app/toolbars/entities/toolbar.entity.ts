import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Session } from '../../sessions/entities/session.entity';

@ObjectType()
@Entity()
export class Toolbar extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'ID for Media' })
  id: number;

  @ManyToOne(() => Session, (session) => session.toolbars)
  @Field((type) => Session, { description: 'Associated Session' })
  @IsNotEmpty()
  session: Session;

  @Column({ nullable: false })
  sessionId: number;

  @Column('simple-array', { default: () => "('')" })
  @Field(
    (type) => [
      String,
    ],
    { defaultValue: [] }
  )
  markers: string[];
}
