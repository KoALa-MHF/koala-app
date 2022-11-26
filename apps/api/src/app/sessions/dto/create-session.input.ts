import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { SessionStatus } from '../entities/session.entity';

@InputType()
export class CreateSessionInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => SessionStatus, { defaultValue: SessionStatus.OPEN })
  @IsEnum(SessionStatus)
  @IsOptional()
  status?: SessionStatus;

  @Field()
  start: Date;

  @Field()
  end: Date;

  @Field()
  isEditable: boolean;

  @Field()
  isPlayerEnabled: boolean;

  @Field()
  isSampleSolutionDisplayed: boolean;

  @Field()
  isLiveAnalysisDisplayed: boolean;
}
