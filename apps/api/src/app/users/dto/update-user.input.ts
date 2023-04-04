import { InputType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field({ description: 'User Displayname', nullable: true })
  @IsOptional()
  displayName?: string;
}
