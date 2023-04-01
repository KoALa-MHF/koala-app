import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSessionsService } from '../user-sessions/user-sessions.service';
import { User } from '../users/entities/user.entity';
import { CreateAnnotationInput } from './dto/create-annotation.input';
import { UpdateAnnotationInput } from './dto/update-annotation.input';
import { Annotation } from './entities/annotation.entity';

@Injectable()
export class AnnotationsService {
  constructor(
    @InjectRepository(Annotation)
    private annotationsRepository: Repository<Annotation>,
    @Inject(forwardRef(() => UserSessionsService))
    private readonly userSessionsService: UserSessionsService
  ) {}

  async create(createMarkerInput: CreateAnnotationInput, user: User) {
    const userSession = await this.userSessionsService.findOne(createMarkerInput.userSessionId, user);

    const newAnnotation = this.annotationsRepository.create({
      start: createMarkerInput.start,
      end: createMarkerInput.end,
      marker: {
        id: createMarkerInput.markerId,
      },
      userSession: {
        id: userSession.id,
      },
      note: createMarkerInput.note,
    });

    return this.annotationsRepository.save(newAnnotation);
  }

  findAll(user: User): Promise<Annotation[]> {
    return this.annotationsRepository
      .createQueryBuilder('annotation')
      .leftJoinAndSelect('annotation.userSession', 'userSession')
      .leftJoinAndSelect('userSession.user', 'user')
      .where('user.id = :id', { id: user.id })
      .getMany();
  }

  findAllByUserSession(userSessionId: number) {
    return this.annotationsRepository.findBy({
      userSessionId,
    });
  }

  async findOne(id: number, user?: User) {
    const annotation = await this.annotationsRepository.findOne({
      where: { id },
      relations: {
        userSession: true,
      },
    });

    if (!annotation) {
      throw new NotFoundException();
    }

    if (user && annotation.userSession.userId !== user.id) {
      throw new ForbiddenException();
    }

    return annotation;
  }

  async update(id: number, updateAnnotationInput: UpdateAnnotationInput, user: User) {
    const annotation = await this.findOne(id, user);

    this.annotationsRepository.merge(annotation, {
      note: updateAnnotationInput.note,
    });

    return this.annotationsRepository.save(annotation);
  }

  async remove(id: number, user: User) {
    const annotation = await this.findOne(id, user);
    await this.annotationsRepository.remove(annotation);
    annotation.id = id;
    return annotation;
  }
}
