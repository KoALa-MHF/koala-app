import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';

@ObjectType()
@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: 'ID for Media' })
  id: number;

  @Column()
  @Field({ description: 'Media Name' })
  name: string;

  @Column()
  @Field({ description: 'Media Mime Type' })
  mimeType: string;
}
