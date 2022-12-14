import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream } from 'fs';
import { Repository } from 'typeorm';
import { CreateMediaInput } from './dto/create-media.input';
import { UpdateMediaInput } from './dto/update-media.input';
import { Media } from './entities/media.entity';
import { ensureDir } from 'fs-extra';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>
  ) {}

  async create(createMediaInput: CreateMediaInput): Promise<Media> {
    const newMedia = this.mediaRepository.create();

    newMedia.type = createMediaInput.type;

    const { createReadStream, filename } = await createMediaInput.file;

    const savedMedia = await this.mediaRepository.save(newMedia);

    await ensureDir(`./uploads/media/${savedMedia.id}`);

    return new Promise((resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(`./uploads/media/${savedMedia.id}/${filename}`))
        .on('finish', () => {
          resolve(savedMedia);
        })
        .on('drain', () => {
          reject(new BadRequestException('File too large'));
        })
        .on('error', () => {
          reject(new BadRequestException('Could not save file'));
        })
    );
  }

  findAll(): Promise<Media[]> {
    return this.mediaRepository.find();
  }

  findOne(id: number): Promise<Media> {
    return this.mediaRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateMediaInput: UpdateMediaInput): Promise<Media> {
    try {
      await this.mediaRepository.update(id, {});

      return this.findOne(id);
    } catch (error) {
      throw new BadRequestException(error.detail);
    }
  }

  remove(id: number) {
    return this.mediaRepository.delete(id);
  }
}
