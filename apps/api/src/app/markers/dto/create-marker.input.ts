import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, ValidateIf } from 'class-validator';
import { DEFAULT_COLOR, MarkerType } from '../entities/marker.entity';
import { Transform } from 'class-transformer';

@InputType()
export class CreateMarkerInput {
  @Field(() => MarkerType, { description: 'Marker Type' })
  @IsEnum(MarkerType)
  @IsNotEmpty()
  type: MarkerType;

  @Field({ description: 'Marker Name' })
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true, description: 'Marker Name Abbreviation (e.g. for small screen sizes' })
  @ValidateIf((o) => o.type !== MarkerType.SLIDER && (!o.icon || o.abbreviation))
  @IsNotEmpty()
  abbreviation?: string;

  @Field({ defaultValue: '', description: 'Marker Descritpion' })
  description?: string;

  @Field({ defaultValue: DEFAULT_COLOR, description: 'Marker Color' })
  color?: string;

  @Field({ nullable: true, description: 'Marker Icon' })
  @ValidateIf((o) => o.type !== MarkerType.SLIDER && (!o.abbreviation || o.icon))
  @IsNotEmpty()
  icon?: string;

  @Field(() => Int, { nullable: true, description: 'Marker Value Range From' })
  @ValidateIf((o) => o.type === MarkerType.SLIDER)
  @IsNotEmpty()
  @Transform(({ value, obj }) => (obj.type !== MarkerType.SLIDER ? null : value))
  valueRangeFrom: number;

  @Field(() => Int, { nullable: true, description: 'Marker Value Range To' })
  @ValidateIf((o) => o.type === MarkerType.SLIDER)
  @IsNotEmpty()
  @Transform(({ value, obj }) => (obj.type !== MarkerType.SLIDER ? null : value))
  valueRangeTo: number;
}
