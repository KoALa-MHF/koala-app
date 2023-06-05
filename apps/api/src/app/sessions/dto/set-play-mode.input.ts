import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PlayMode } from '../entities/session.entity';

@InputType()
export class SetPlayModeInput {
  @Field(() => PlayMode, { defaultValue: PlayMode.PAUSED })
  @IsEnum(PlayMode)
  @IsNotEmpty()
  playMode: PlayMode;
}
