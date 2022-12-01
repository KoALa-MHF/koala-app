import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnnotationInput } from './dto/create-annotation.input';
import { UpdateAnnotationInput } from './dto/update-annotation.input';
import { Annotation } from './entities/annotation.entity';

@Injectable()
export class AnnotationsService {

  constructor(
    @InjectRepository(Annotation)
    private annotationsRepository: Repository<Annotation>
  ) {}

  create(createMarkerInput: CreateAnnotationInput) {
    const newAnnotation = this.annotationsRepository.create({
      start : createMarkerInput.start,
      end : createMarkerInput.end,
      marker : {
        id : createMarkerInput.markerId
      },
      userSession : {
        id : createMarkerInput.userSessionId
      }
    });

    return this.annotationsRepository.save(newAnnotation);
  }

  findAll() {
    return this.annotationsRepository.find();
  }

  findOne(id: number) {
    return this.annotationsRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateAnnotationInput: UpdateAnnotationInput) {
    try {
      await this.annotationsRepository.update(id, {
        start: updateAnnotationInput.start,
        end: updateAnnotationInput.end,
        marker: { 
          id : updateAnnotationInput.markerId
        }
      });

      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  remove(id: number) {
    return this.annotationsRepository.delete(id);
  }

}


