import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { MarkerType } from '../entities/marker.entity';

@InputType()
export class CreateMarkerInput {
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
