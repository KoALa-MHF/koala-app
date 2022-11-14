import { CreateMarkerInput } from './create-marker.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { MarkerType } from '../entities/marker.entity';

@InputType()
export class UpdateMarkerInput extends PartialType(CreateMarkerInput) {
  @Field(() => MarkerType, { description: 'Marker Type' })
  @IsEnum(MarkerType)
  @IsNotEmpty()
  type: MarkerType;

  @Field({ description: 'Marker Name' })
  @IsNotEmpty()
  name: string;

  @Field({ description: 'Marker Name' })
  @IsNotEmpty()
  color: string;
}
