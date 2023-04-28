import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class SetToolbarMarkerVisibilityInput {
  @Field((type) => ID)
  markerId: number;

  @Field((type) => Boolean)
  visible: boolean;
}
