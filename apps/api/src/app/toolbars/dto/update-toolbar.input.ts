import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateToolbarInput {
  @Field(
    (type) => [
      String,
    ],
    { defaultValue: [] }
  )
  markers: string[];
}
