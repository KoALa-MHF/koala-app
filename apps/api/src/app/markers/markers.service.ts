import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMarkerInput } from './dto/create-marker.input';
import { UpdateMarkerInput } from './dto/update-marker.input';
import { Marker } from './entities/marker.entity';
import { In } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MarkersService {
  constructor(
    @InjectRepository(Marker)
    private markersRepository: Repository<Marker>
  ) {}

  create(createMarkerInput: CreateMarkerInput, owner: User) {
    const newMarker = this.markersRepository.create({
      name: createMarkerInput.name,
      abbreviation: createMarkerInput.abbreviation,
      description: createMarkerInput.description,
      type: createMarkerInput.type,
      color: createMarkerInput.color,
      contentColor: createMarkerInput.contentColor,
      icon: createMarkerInput.icon,
      valueRangeFrom: createMarkerInput.valueRangeFrom,
      valueRangeTo: createMarkerInput.valueRangeTo,
      owner,
    });

    return this.markersRepository.save(newMarker);
  }

  findAll(ids: Array<number>) {
    const query = ids
      ? {
          where: {
            id: In(ids),
          },
        }
      : undefined;
    return this.markersRepository.find(query);
  }

  async findOne(id: number) {
    const marker = await this.markersRepository.findOneBy({ id });

    if (!marker) {
      throw new NotFoundException();
    }

    return marker;
  }

  async findOneOfOwner(id: number, owner: User): Promise<Marker> {
    const marker = await this.markersRepository.findOne({
      where: {
        id,
        ownerId: owner.id,
      },
    });

    if (!marker) {
      throw new NotFoundException();
    }

    return marker;
  }

  async update(id: number, updateMarkerInput: UpdateMarkerInput, owner: User) {
    const marker = await this.findOneOfOwner(id, owner);

    this.markersRepository.merge(marker, {
      name: updateMarkerInput.name,
      abbreviation: updateMarkerInput.abbreviation,
      icon: updateMarkerInput.icon,
      description: updateMarkerInput.description,
      type: updateMarkerInput.type,
      color: updateMarkerInput.color,
      contentColor: updateMarkerInput.contentColor,
      valueRangeFrom: updateMarkerInput.valueRangeFrom,
      valueRangeTo: updateMarkerInput.valueRangeTo,
    });

    return this.markersRepository.save(marker);
  }

  async remove(id: number, owner: User) {
    const marker = await this.findOneOfOwner(id, owner);
    await this.markersRepository.remove(marker);
    marker.id = id;
    return marker;
  }
}
