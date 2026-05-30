import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class SetMediaDurationInput {
  @Field()
  @IsNotEmpty()
  mediaDuration: number;
}
