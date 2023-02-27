import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class AuthenticateUserSessionInput {
  @Field({ nullable: true, description: 'User Session Email' })
  @MaxLength(7)
  @IsNotEmpty()
  code: string;
}
