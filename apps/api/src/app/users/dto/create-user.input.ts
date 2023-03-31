import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field({ description: 'User Email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
