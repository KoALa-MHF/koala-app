import { InputType, Field, Int } from '@nestjs/graphql';
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
  editable: boolean;

  @Field()
  enablePlayer: boolean;

  @Field()
  displaySampleSolution: boolean;

  @Field()
  enableLiveAnalysis: boolean;

  @Field(() => Int, { nullable: true, description: 'Assigned Media' })
  @IsOptional()
  mediaId: number;
}
