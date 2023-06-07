import { CreateSessionInput } from './create-session.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSessionInput extends PartialType(CreateSessionInput) {
  @Field({ nullable: true })
  liveSessionStart: Date;
}
