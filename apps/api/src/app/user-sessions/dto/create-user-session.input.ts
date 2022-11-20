import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserSessionInput {
  @Field(() => Int, { description: 'Associated Session' })
  @IsNotEmpty()
  sessionId: number;
}
