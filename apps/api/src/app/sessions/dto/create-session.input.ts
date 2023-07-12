import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { SessionStatus } from '../entities/session.entity';

@InputType()
export class CreateSessionInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => SessionStatus, { defaultValue: SessionStatus.OPEN })
  @IsEnum(SessionStatus)
  @IsOptional()
  status?: SessionStatus;

  @Field({ nullable: true })
  @IsOptional()
  start?: Date;

  @Field({ nullable: true })
  @IsOptional()
  end?: Date;

  @Field({ nullable: true })
  @IsOptional()
  editable?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  enablePlayer?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  displaySampleSolution?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  enableLiveAnalysis?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  enableAnnotationDelete?: boolean;

  @Field(() => Int, { nullable: true, description: 'Assigned Media' })
  @IsOptional()
  mediaId?: number;
}
