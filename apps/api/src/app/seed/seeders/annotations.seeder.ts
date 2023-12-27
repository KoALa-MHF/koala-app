import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import { AnnotationsData } from '../data/annotations.data';
import { Annotation } from '../../annotations/entities/annotation.entity';

@Injectable()
export class AnnotationsSeeder implements SeederInterface<Annotation> {
  constructor(
    @InjectRepository(Annotation)
    private annotationsRepository: Repository<Annotation>
  ) {}

  async seed(): Promise<Annotation[]> {
    const annotations: Partial<Annotation>[] = [];

    for (const annotation of AnnotationsData) {
      annotations.push(this.annotationsRepository.create(annotation));
    }

    return await this.annotationsRepository.save(annotations);
  }
}
