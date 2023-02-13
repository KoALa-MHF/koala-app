import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, ValidateIf } from 'class-validator';
import { DEFAULT_COLOR, MarkerType } from '../entities/marker.entity';

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
  @ValidateIf((o) => !o.icon || o.abbreviation)
  @IsNotEmpty()
  abbreviation?: string;

  @Field({ defaultValue: '', description: 'Marker Descritpion' })
  description?: string;

  @Field({ defaultValue: DEFAULT_COLOR, description: 'Marker Color' })
  color?: string;

  @Field({ nullable: true, description: 'Marker Icon' })
  @ValidateIf((o) => !o.abbreviation || o.icon)
  @IsNotEmpty()
  icon?: string;
}
