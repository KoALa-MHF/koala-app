import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateExternalMediaInput {
  @Field()
  @IsNotEmpty()
  url: string;
}
