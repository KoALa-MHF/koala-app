import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMarkerInput } from './dto/create-marker.input';
import { UpdateMarkerInput } from './dto/update-marker.input';
import { Marker } from './entities/marker.entity';

@Injectable()
export class MarkersService {

  constructor(
    @InjectRepository(Marker)
    private markersRepository: Repository<Marker>
  ) {}
  
  create(CreateMarkerInput: CreateMarkerInput) {
    const newMarker = this.markersRepository.create();

    newMarker.name = CreateMarkerInput.name;
    newMarker.type = CreateMarkerInput.type;
    newMarker.color = CreateMarkerInput.color;

    return this.markersRepository.save(newMarker);
  }

  findAll() {
    return this.markersRepository.find();
  }

  findOne(id: number) {
    return this.markersRepository.findOneByOrFail({ id });
  }

  async update(id: number, UpdateMarkerInput: UpdateMarkerInput) {
    try {
      await this.markersRepository.update(id, {
        name: UpdateMarkerInput.name,
        type: UpdateMarkerInput.type,
        color: UpdateMarkerInput.color
      });

      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  remove(id: number) {
    return this.markersRepository.delete(id);
  }
}
