import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { PlayMode } from '../entities/session.entity';

@InputType()
export class SetPlayModeInput {
  @Field(() => PlayMode, { defaultValue: PlayMode.PAUSED })
  @IsEnum(PlayMode)
  @IsNotEmpty()
  playMode: PlayMode;

  @Field({ nullable: true })
  @IsOptional()
  liveSessionStart?: Date;

  @Field({ nullable: true })
  @IsOptional()
  liveSessionEnd?: Date;
}
