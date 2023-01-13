import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream } from 'fs';
import { Repository } from 'typeorm';
import { CreateMediaInput } from './dto/create-media.input';
import { Media } from './entities/media.entity';
import { FileUpload } from 'graphql-upload';
import { ensureMediaFolder, getFilePath } from './media.util';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>
  ) {}

  async create(createMediaInput: CreateMediaInput): Promise<Media> {
    const file: FileUpload = await createMediaInput.file;

    const newMedia = this.mediaRepository.create();
    newMedia.name = file.filename;
    newMedia.mimeType = file.mimetype;

    const media = await this.mediaRepository.save(newMedia);

    await this.writeMediaFile(media.id, file);

    return media;
  }

  private async writeMediaFile(id: number, file: FileUpload): Promise<void> {
    await ensureMediaFolder(id);

    const filePath = getFilePath(id, file.filename);

    return new Promise((resolve, reject) =>
      file
        .createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', () => {
          resolve();
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

  remove(id: number) {
    return this.mediaRepository.delete(id);
  }
}
