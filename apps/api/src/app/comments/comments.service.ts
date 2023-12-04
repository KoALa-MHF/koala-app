import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { User } from '../users/entities/user.entity';
import { UpdateCommentInput } from './dto/update-comment.input';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>
  ) {}

  async create(createCommentInput: CreateCommentInput, user: User): Promise<Comment> {
    const comment = this.commentsRepository.create({
      text: createCommentInput.text,
      annotation: {
        id: createCommentInput.annotationId,
      },
      owner: user,
    });
    return this.commentsRepository.save(comment);
  }

  async findOne(id: number, user?: User) {
    const comment = await this.commentsRepository.findOneBy({ id });

    if (!comment) {
      throw new NotFoundException();
    }

    if (user && comment.ownerId !== user.id) {
      throw new ForbiddenException();
    }

    return comment;
  }

  async remove(id: number, user: User) {
    const comment = await this.findOne(id, user);

    await this.commentsRepository.remove(comment);

    comment.id = id;
    return comment;
  }

  async update(id: number, updateCommentInput: UpdateCommentInput, user: User) {
    const comment = await this.findOne(id, user);

    this.commentsRepository.merge(comment, {
      text: updateCommentInput.text,
    });

    return this.commentsRepository.save(comment);
  }
}
