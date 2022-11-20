import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';
import { Marker } from '../../markers/entities/marker.entity';

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

  @JoinColumn()
  @ManyToOne(() => Marker, {
    eager: true,
  })
  @Field(type => Marker, { description: 'Associated Marker' })
  @IsNotEmpty()
  marker: Marker;
}
