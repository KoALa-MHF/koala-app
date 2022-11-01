import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateSessionInput {

  @Field()
  @IsNotEmpty()
  name: string;
}