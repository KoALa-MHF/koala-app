import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
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
  status?: SessionStatus;
}
