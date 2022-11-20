import { CreateUserSessionInput } from './create-user-session.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { USER_SESSION_NOTE_MAX_LENGTH } from '../entities/user-session.entity';

@InputType()
export class UpdateUserSessionInput {
  @Field({ description: 'User Session Note' })
  @MaxLength(USER_SESSION_NOTE_MAX_LENGTH)
  note: string;
}
