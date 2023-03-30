import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class AuthenticateUserSessionInput {
  @Field({ nullable: false, description: 'User Session Code' })
  @MaxLength(7)
  @IsNotEmpty()
  code: string;
}
