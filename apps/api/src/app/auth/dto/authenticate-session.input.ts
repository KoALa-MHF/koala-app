import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class AuthenticateSessionInput {
  @Field({ nullable: false, description: 'Session Code' })
  @MaxLength(7)
  @IsNotEmpty()
  code: string;
}
