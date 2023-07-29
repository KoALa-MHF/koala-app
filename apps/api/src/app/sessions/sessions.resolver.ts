import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent, Subscription, ID } from '@nestjs/graphql';
import { SessionsService } from './sessions.service';
import { Session } from './entities/session.entity';
import { CreateSessionInput } from './dto/create-session.input';
import { UpdateSessionInput } from './dto/update-session.input';
import { MediaService } from '../media/media.service';
import { ToolbarsService } from '../toolbars/toolbars.service';
import { forwardRef, Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserSessionsService } from '../user-sessions/user-sessions.service';
import { AuthGuard } from '../core/guards/auth.guard';
import { CurrentUser } from '../core/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { RegisteredUserGuard } from '../core/guards/registerd-user.guard';
import { PubSub } from 'graphql-subscriptions';
import { SetPlayModeInput } from './dto/set-play-mode.input';
import { SetPlayPositionInput } from './dto/set-play-position.input';
import { ServerTimeInterceptor } from './server-time.interceptor';
import { SessionOwnerInterceptor } from './session-owner.interceptor';
import { AudioSessionInterceptor } from './audio-session.interceptor';
import { AnnotationJSON, SessionJSON, UserSessionJSON } from './dto/export-session-json.output';

const pubSub = new PubSub();

@Resolver(() => Session)
export class SessionsResolver {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly mediaService: MediaService,
    @Inject(forwardRef(() => ToolbarsService))
    private readonly toolbarsService: ToolbarsService,
    @Inject(forwardRef(() => UserSessionsService))
    private readonly userSessionsService: UserSessionsService,
    private readonly usersService: UsersService
  ) {}

  @Mutation(() => Session)
  @UseGuards(AuthGuard, RegisteredUserGuard)
  @UseInterceptors(ServerTimeInterceptor, SessionOwnerInterceptor, AudioSessionInterceptor)
  createSession(@Args('createSessionInput') createSessionInput: CreateSessionInput, @CurrentUser() user: User) {
    return this.sessionsService.create(createSessionInput, user);
  }

  @Query(
    () => [
      Session,
    ],
    { name: 'sessions' }
  )
  @UseGuards(AuthGuard)
  @UseInterceptors(ServerTimeInterceptor, SessionOwnerInterceptor, AudioSessionInterceptor)
  findAll(@CurrentUser() user: User) {
    return this.sessionsService.findAll(user);
  }

  @Query(() => Session, { name: 'session' })
  @UseGuards(AuthGuard)
  @UseInterceptors(ServerTimeInterceptor, SessionOwnerInterceptor, AudioSessionInterceptor)
  findOne(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: User) {
    return this.sessionsService.findOne(id, user);
  }

  @Query(() => Session, { name: 'sessionByCode' })
  @UseGuards(AuthGuard)
  @UseInterceptors(ServerTimeInterceptor, SessionOwnerInterceptor, AudioSessionInterceptor)
  async findOneBySessionCode(@Args('code', { type: () => String }) code: string) {
    let session = await this.sessionsService.findOneByCode(code);

    if (!session) {
      session = await this.sessionsService.findOneByUserSessionCode(code);
    }

    return session;
  }

  @Query(() => SessionJSON)
  @UseGuards(AuthGuard, RegisteredUserGuard)
  @UseInterceptors(AudioSessionInterceptor)
  async exportSessionAsJSON(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: User) {
    const session = await this.sessionsService.findOne(id, user);
    const userSessions = await this.userSessionsService.findAllBySessionWithAnnotations(id, user);

    const userSessionsJSON = userSessions.map((userSession) => {
      const annotations = userSession.annotations
        ? userSession.annotations.map((annotation) => {
            return { ...annotation, marker: annotation.marker } as AnnotationJSON;
          })
        : [];

      return { ...userSession, annotations: annotations } as UserSessionJSON;
    });

    return { ...session, userSessions: userSessionsJSON };
  }

  @Mutation(() => Session)
  @UseGuards(AuthGuard, RegisteredUserGuard)
  @UseInterceptors(ServerTimeInterceptor, SessionOwnerInterceptor, AudioSessionInterceptor)
  updateSession(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateSessionInput') updateSessionInput: UpdateSessionInput,
    @CurrentUser() user: User
  ) {
    const session = this.sessionsService.update(id, updateSessionInput, user);
    pubSub.publish('sessionUpdated', { sessionUpdated: session });
    return session;
  }

  @Mutation(() => Session)
  @UseGuards(AuthGuard, RegisteredUserGuard)
  @UseInterceptors(ServerTimeInterceptor, SessionOwnerInterceptor, AudioSessionInterceptor)
  setPlayMode(
    @Args('id', { type: () => Int }) id: number,
    @Args('setPlayModeInput') setPlayModeInput: SetPlayModeInput,
    @CurrentUser() user: User
  ) {
    const session = this.sessionsService.setPlayMode(id, setPlayModeInput, user);
    pubSub.publish('sessionUpdated', { sessionUpdated: session });
    return session;
  }

  @Mutation(() => Session)
  @UseGuards(AuthGuard, RegisteredUserGuard)
  @UseInterceptors(ServerTimeInterceptor, SessionOwnerInterceptor, AudioSessionInterceptor)
  setPlayPosition(
    @Args('id', { type: () => Int }) id: number,
    @Args('setPlayPositionInput') setPlayPositionInput: SetPlayPositionInput,
    @CurrentUser() user: User
  ) {
    const session = this.sessionsService.setPlayPosition(id, setPlayPositionInput, user);
    pubSub.publish('sessionUpdated', { sessionUpdated: session });
    return session;
  }

  @Mutation(() => Session)
  @UseGuards(AuthGuard, RegisteredUserGuard)
  removeSession(@Args('id', { type: () => Int }) id: number, @CurrentUser() user: User) {
    return this.sessionsService.remove(id, user);
  }

  @Subscription((returns) => Session, {
    filter: async (payload, variables) => {
      const payloadResult = await payload.sessionUpdated;

      return payloadResult.id == variables.id;
    },
  })
  //@UseGuards(AuthGuard)
  sessionUpdated(@Args('id', { type: () => ID }) id: number) {
    return pubSub.asyncIterator('sessionUpdated');
  }

  @ResolveField()
  @UseGuards(AuthGuard)
  media(@Parent() session: Session) {
    const { mediaId } = session;
    if (mediaId) {
      return this.mediaService.findOne(mediaId);
    }
  }

  @ResolveField()
  @UseGuards(AuthGuard)
  toolbars(@Parent() session: Session) {
    return this.toolbarsService.findAll(session.id);
  }

  @ResolveField()
  @UseGuards(AuthGuard)
  owner(@Parent() session: Session) {
    const { ownerId } = session;
    return this.usersService.findOne(ownerId);
  }

  @ResolveField()
  @UseGuards(AuthGuard)
  userSessions(@Parent() session: Session, @CurrentUser() user: User) {
    return this.userSessionsService.findAllBySession(session.id, user);
  }
}
