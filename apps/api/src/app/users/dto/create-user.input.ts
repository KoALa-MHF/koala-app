import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field({ description: 'User Email', nullable: true })
  @IsEmail()
  @IsOptional()
  email: string;
}
