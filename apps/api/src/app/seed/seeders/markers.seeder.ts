import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import { Marker } from '../../markers/entities/marker.entity';
import { MarkersData } from '../data/markers.data';

@Injectable()
export class MarkersSeeder implements SeederInterface<Marker> {
  constructor(
    @InjectRepository(Marker)
    private markersRepository: Repository<Marker>
  ) {}

  async seed(): Promise<Marker[]> {
    const markers: Partial<Marker>[] = [];

    for (const marker of MarkersData) {
      markers.push(this.markersRepository.create(marker));
    }

    return await this.markersRepository.save(markers);
  }
}
