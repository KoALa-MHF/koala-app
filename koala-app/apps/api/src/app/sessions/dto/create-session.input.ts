import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSessionInput {

  @Field()
  name: string;
}
