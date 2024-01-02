import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import { CommentsData } from '../data/comments.data';
import { Comment } from '../../comments/entities/comment.entity';

@Injectable()
export class CommentsSeeder implements SeederInterface<Comment> {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>
  ) {}

  async seed(): Promise<Comment[]> {
    const comments: Partial<Comment>[] = [];

    for (const comment of CommentsData) {
      comments.push(this.commentsRepository.create(comment));
    }

    return await this.commentsRepository.save(comments);
  }
}
