import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ToolbarMarker {
  @Field(() => ID, { description: 'Marker ID' })
  markerId: number;

  @Field(() => Boolean)
  visible: boolean;
}
