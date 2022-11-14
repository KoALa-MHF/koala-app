import { CreateMarkerInput } from './create-marker.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DEFAULT_COLOR, MarkerType } from '../entities/marker.entity';

@InputType()
export class UpdateMarkerInput extends PartialType(CreateMarkerInput) {
  @Field(() => MarkerType, { description: 'Marker Type' })
  @IsEnum(MarkerType)
  @IsNotEmpty()
  type: MarkerType;

  @Field({ description: 'Marker Name' })
  @IsNotEmpty()
  name: string;

  @Field({ defaultValue: DEFAULT_COLOR, description: 'Marker Color' })
  color: string;
}
