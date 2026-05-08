import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream } from 'fs';
import { Repository } from 'typeorm';
import { CreateMediaInput } from './dto/create-media.input';
import { Media } from './entities/media.entity';
import { FileUpload } from 'graphql-upload';
import { ensureMediaFolder, getFilePath } from './media.util';
import { unlink } from 'node:fs/promises';
import { CreateExternalMediaInput } from './dto/create-external-media.input';

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

  async createExternal(createExternalMediaInput: CreateExternalMediaInput): Promise<Media> {
    const newMedia = this.mediaRepository.create();
    newMedia.name = createExternalMediaInput.url;

    if (newMedia.name.includes('youtube.com/embed')) {
      newMedia.mimeType = 'external/youtube';
    } else if (newMedia.name.includes('tube.switch.ch/embed')) {
      newMedia.mimeType = 'external/switchtube';
    } else if (newMedia.name.includes('tube.switch.ch/external')) {
      newMedia.mimeType = 'external/switchtubeExternal';
    } else {
      throw new BadRequestException('Unsupported media type');
    }

    const media = await this.mediaRepository.save(newMedia);

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

  async remove(id: number) {
    const media = await this.findOne(id);

    if (!media) {
      throw new BadRequestException('Media not found');
    }

    await this.deleteMediaFile(id, media.name);

    await this.mediaRepository.delete(id);

    return media;
  }

  private async deleteMediaFile(id: number, filename: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const filePath = getFilePath(id, filename);

      try {
        await unlink(filePath);

        console.log(`Successfully deleted ${filePath}`);

        resolve();
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          console.log(`File ${filePath} does not exist, skipping deletion.`);

          resolve();
        } else {
          console.error(`Error deleting file ${filePath}:`, error);
          reject(new BadRequestException('Could not delete file'));
        }
      }
    });
  }
}
