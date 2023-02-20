import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

@InputType()
export class InviteUserSessionInput {
  @Field(
    () => [
      ID,
    ],
    { description: 'Associated Session' }
  )
  @IsNotEmpty()
  userSessionIds: number[];

  @Field({ nullable: true, description: 'User Session Email' })
  @MaxLength(200)
  @IsOptional()
  message?: string;
}
