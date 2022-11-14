import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum MarkerType {
  RANGE = "range",
  EVENT = "event"
}

export const DEFAULT_COLOR = "black";

registerEnumType(MarkerType, {
  name : "MarkerType"
});

@ObjectType()
@Entity()
export class Marker {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'ID for Marker' })
  id: number;

  @Column({
    type: "simple-enum",
    enum: MarkerType
  })
  @Field(() => MarkerType, { description: 'Marker Type' })
  @IsEnum(MarkerType)
  @IsNotEmpty()
  type: MarkerType;

  @Column()
  @Field({ description: 'Marker Name' })
  @IsNotEmpty()
  name: string;

  @Column({default: DEFAULT_COLOR})
  @Field({ defaultValue: DEFAULT_COLOR, description: 'Marker Color' })
  color: string;
}
