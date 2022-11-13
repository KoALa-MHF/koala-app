import { CreateMediaInput } from './create-media.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMediaInput extends PartialType(CreateMediaInput) {
  @Field(() => Int)
  id: number;
}
