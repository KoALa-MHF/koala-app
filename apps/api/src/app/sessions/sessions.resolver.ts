import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SessionsService } from './sessions.service';
import { Session } from './entities/session.entity';
import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';
import { AddMarkerToSessionInput } from './dto/add-marker-to-session.input';

@Resolver(() => Session)
export class SessionsResolver {
  constructor(private readonly sessionsService: SessionsService) {}

  @Mutation(() => Session)
  createSession(@Args('createSessionInput') createSessionInput: CreateSessionInput) {
    return this.sessionsService.create(createSessionInput);
  }

  @Query(
    () => [
      Session,
    ],
    { name: 'sessions' }
  )
  findAll() {
    return this.sessionsService.findAll();
  }

  @Query(() => Session, { name: 'session' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.sessionsService.findOne(id);
  }

  @Mutation(() => Session)
  updateSession(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateSessionInput') updateSessionInput: UpdateSessionInput
  ) {
    return this.sessionsService.update(id, updateSessionInput);
  }

  @Mutation(() => Session)
  removeSession(@Args('id', { type: () => Int }) id: number) {
    return this.sessionsService.remove(id);
  }

  @Mutation(() => Session)
  addMarkerToSession(@Args('addMarkerToSessionInput') addMarkerInput: AddMarkerToSessionInput) {
    return this.sessionsService.addMarker(addMarkerInput.sessionId, addMarkerInput.markerId);
  }
}
