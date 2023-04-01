import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';

@InputType()
export class AuthenticateSessionInput {
  @Field({ nullable: false, description: 'Session Code' })
  @Length(7, 7)
  @IsNotEmpty()
  code: string;
}
