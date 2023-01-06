import { CreateToolbarInput } from './create-toolbar.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateToolbarInput extends PartialType(CreateToolbarInput) {
  @Field(() => Int)
  id: number;
}
