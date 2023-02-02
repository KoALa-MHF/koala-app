import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Session } from '../../sessions/entities/session.entity';

@ObjectType()
@Entity()
export class Toolbar extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'ID for Media' })
  id: number;

  @JoinColumn()
  @ManyToOne(() => Session, (session) => session.toolbars, { eager: true })
  @Field((type) => Session, { description: 'Associated Session' })
  @IsNotEmpty()
  session: Session;

  @Column('simple-array', { default: () => "('')" })
  @Field(
    (type) => [
      String,
    ],
    { defaultValue: [] }
  )
  markers: string[];
}
