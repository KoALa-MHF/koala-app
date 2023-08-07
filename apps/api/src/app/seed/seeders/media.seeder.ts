import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeederInterface } from '../seeder.interface';
import { Media } from '../../media/entities/media.entity';
import { MediaData } from '../data/media.data';
import { clearMediaFolder, ensureMediaFolder, getMediaFolderPath } from '../../media/media.util';
import { copy } from 'fs-extra';
import { resolve } from 'path';

@Injectable()
export class MediaSeeder implements SeederInterface<Media> {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>
  ) {}

  async seed(): Promise<Media[]> {
    await clearMediaFolder();

    const mediaArr: Partial<Media>[] = [];

    for (const media of MediaData) {
      await ensureMediaFolder(media.id);
      await copy(resolve(__dirname, `../data/media/${media.name}`), `${getMediaFolderPath(media.id)}/${media.name}`);
      mediaArr.push(this.mediaRepository.create(media));
    }

    return await this.mediaRepository.save(mediaArr);
  }
}
