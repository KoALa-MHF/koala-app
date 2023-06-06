import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class SetPlayPositionInput {
  @Field()
  @IsNotEmpty()
  playPosition: number;
}
