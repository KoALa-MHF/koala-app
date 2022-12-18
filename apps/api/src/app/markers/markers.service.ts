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

  create(createMarkerInput: CreateMarkerInput) {
    const newMarker = this.markersRepository.create();

    newMarker.name = createMarkerInput.name;
    newMarker.abbreviation = createMarkerInput.abbreviation;
    newMarker.description = createMarkerInput.description;
    newMarker.type = createMarkerInput.type;
    newMarker.color = createMarkerInput.color;

    return this.markersRepository.save(newMarker);
  }

  findAll() {
    return this.markersRepository.find();
  }

  findOne(id: number) {
    return this.markersRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateMarkerInput: UpdateMarkerInput) {
    try {
      await this.markersRepository.update(id, {
        name: updateMarkerInput.name,
        abbreviation: updateMarkerInput.abbreviation,
        description: updateMarkerInput.description,
        type: updateMarkerInput.type,
        color: updateMarkerInput.color,
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
