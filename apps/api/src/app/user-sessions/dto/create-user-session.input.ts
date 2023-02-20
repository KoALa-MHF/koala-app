import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { USER_SESSION_NOTE_MAX_LENGTH } from '../entities/user-session.entity';

@InputType()
export class CreateUserSessionInput {
  @Field(() => Int, { description: 'Associated Session' })
  @IsNotEmpty()
  sessionId: number;

  @Field({ defaultValue: '', description: 'User Session Note' })
  @MaxLength(USER_SESSION_NOTE_MAX_LENGTH)
  note?: string;

  @Field({ description: 'User Session Email' })
  @IsEmail()
  email: string;
}
