import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

@InputType()
export class InviteUserSessionInput {
  @Field(() => Int, { description: 'Associated Session' })
  @IsNotEmpty()
  sessionId: number;

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
