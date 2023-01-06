import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateToolbarInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
