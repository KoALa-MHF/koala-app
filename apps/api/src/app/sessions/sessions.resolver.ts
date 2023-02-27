import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { SessionsService } from './sessions.service';
import { Session } from './entities/session.entity';
import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';
import { MediaService } from '../media/media.service';
import { ToolbarsService } from '../toolbars/toolbars.service';
import { forwardRef, Inject } from '@nestjs/common';
import { UserSessionsService } from '../user-sessions/user-sessions.service';

@Resolver(() => Session)
export class SessionsResolver {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly mediaService: MediaService,
    @Inject(forwardRef(() => ToolbarsService))
    private readonly toolbarsService: ToolbarsService,
    @Inject(forwardRef(() => UserSessionsService))
    private readonly userSessionsService: UserSessionsService
  ) {}

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

  @ResolveField()
  media(@Parent() session: Session) {
    const { mediaId } = session;
    if (mediaId) {
      return this.mediaService.findOne(mediaId);
    }
  }

  @ResolveField()
  toolbars(@Parent() session: Session) {
    return this.toolbarsService.findAll(session.id);
  }

  @ResolveField()
  userSessions(@Parent() session: Session) {
    return this.userSessionsService.findAll(session.id);
  }
}
