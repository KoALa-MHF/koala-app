import { CreateSessionInput } from './create-session.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { SessionStatus } from '../entities/session.entity';

@InputType()
export class UpdateSessionInput extends PartialType(CreateSessionInput) {
  @Field(() => Int)
  id: number;
  @Field()
  @IsNotEmpty()
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => SessionStatus)
  @IsEnum(SessionStatus)
  status?: SessionStatus;
}
