import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class AddMarkerToToolbarInput {
  @Field(() => Int, { description: 'Toolbar ID' })
  @IsNotEmpty()
  toolbarId: number;

  @Field(() => Int, { description: 'Associated Marker' })
  @IsNotEmpty()
  markerId: number;
}
