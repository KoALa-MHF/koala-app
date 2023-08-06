import { Controller, Get, InternalServerErrorException, NotFoundException, Param, Res } from '@nestjs/common';
import { createReadStream } from 'fs';
import { MediaService } from './media.service';
import type { Response } from 'express';
import { getFilePath, getFileSize } from './media.util';
import { EntityNotFoundError } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../core/decorators/user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getMedia(@Param() params, @Res() res: Response): Promise<void> {
    try {
      const media = await this.mediaService.findOne(params.id);
      if (media) {
        const filePath = getFilePath(media.id, media.name);
        const size = await getFileSize(filePath);
        const file = createReadStream(filePath);

        res.set({
          'Content-Type': media.mimeType,
          'Content-length': size,
          'Cache-Control': 'no-cache',
        });

        file.pipe(res);
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
