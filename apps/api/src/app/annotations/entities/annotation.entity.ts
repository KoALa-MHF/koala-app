import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Marker } from '../../markers/entities/marker.entity';

@ObjectType()
@Entity()
export class Annotation {
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
  @OneToOne(() => Marker)
  @Field(type => Marker, { description: 'Associated Marker' })
  @IsNotEmpty()
  marker: Marker;
}
