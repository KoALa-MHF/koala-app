import { CreateSessionInput } from './create-session.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateSessionInput extends PartialType(CreateSessionInput) {
  @Field(() => Int)
  id: number;
  @Field()
  @IsNotEmpty()
  name?: string;
}
