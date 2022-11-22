import { CreateUserSessionInput } from './create-user-session.input';
import { InputType, PartialType, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateUserSessionInput extends PartialType(
  OmitType(CreateUserSessionInput, ['sessionId'] as const)
) {}
