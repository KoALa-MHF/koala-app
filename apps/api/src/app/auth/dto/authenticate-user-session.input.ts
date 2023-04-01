import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Length, MaxLength } from 'class-validator';

@InputType()
export class AuthenticateUserSessionInput {
  @Field({ nullable: false, description: 'User Session Code' })
  @Length(8, 8)
  @IsNotEmpty()
  code: string;
}
