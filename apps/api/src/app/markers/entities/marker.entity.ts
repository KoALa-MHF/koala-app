import { ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../core/base.entity';

export enum MarkerType {
  RANGE = 'range',
  EVENT = 'event',
  SLIDER = 'slider',
}

export const DEFAULT_COLOR = '#000000';
export const DEFAULT_CONTENT_COLOR = '#FFFFFF';

registerEnumType(MarkerType, {
  name: 'MarkerType',
});

@ObjectType()
@Entity()
export class Marker extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'ID for Marker' })
  id: number;

  @Column({
    type: 'simple-enum',
    enum: MarkerType,
  })
  @Field(() => MarkerType, { description: 'Marker Type' })
  @IsEnum(MarkerType)
  @IsNotEmpty()
  type: MarkerType;

  @Column()
  @Field({ description: 'Marker Name' })
  @IsNotEmpty()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true, description: 'Marker Name Abbreviation (e.g. for small screen sizes' })
  @ValidateIf((o) => !o.icon || o.abbreviation)
  @IsNotEmpty()
  abbreviation: string;

  @Column({ nullable: true, default: '' })
  @Field({ nullable: true, defaultValue: '', description: 'Marker Description' })
  @IsOptional()
  description?: string;

  @Column({ default: DEFAULT_COLOR })
  @Field({ defaultValue: DEFAULT_COLOR, description: 'Marker Color' })
  color: string;

  @Column({ nullable: true })
  @Field({ nullable: true, description: 'Marker Icon' })
  @ValidateIf((o) => o.type !== MarkerType.SLIDER && (!o.abbreviation || o.icon))
  @IsNotEmpty()
  icon: string;

  @Column({ default: DEFAULT_CONTENT_COLOR })
  @Field({ defaultValue: DEFAULT_CONTENT_COLOR, description: 'Marker Content (Text, Icon, Slider Knob) Color' })
  contentColor: string;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true, description: 'Marker Value Range From' })
  @ValidateIf((o) => o.type === MarkerType.SLIDER)
  @IsNotEmpty()
  valueRangeFrom: number;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true, description: 'Marker Value Range To' })
  @ValidateIf((o) => o.type === MarkerType.SLIDER)
  @IsNotEmpty()
  valueRangeTo: number;
}
