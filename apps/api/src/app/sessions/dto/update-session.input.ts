import { CreateSessionInput } from './create-session.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSessionInput extends PartialType(CreateSessionInput) {

}